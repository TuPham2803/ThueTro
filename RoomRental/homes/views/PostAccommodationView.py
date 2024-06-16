from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from homes.models import PostAccommodation, LikeAccommodation, AccommodationImage, PendingStatus
from homes import serializers, perms
from django.contrib.auth import authenticate
from homes.perms import RestrictTo
import cloudinary
from homes.sendmail import send_mail
from threading import Thread
from homes.pagination import SmallPagination
from haversine import haversine, Unit


class PostAccommodationViewSet(viewsets.ViewSet, generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    queryset = PostAccommodation.objects.filter(active=True)
    serializer_class = serializers.PostAccommodationSerializer
    pagination_class = SmallPagination

    def get_permissions(self):
        if self.action == 'comments' and self.request.POST:
            return [permissions.IsAuthenticated()]
        if self.action in ['like']:
            return [permissions.IsAuthenticated()]
        if self.action == 'create' and self.request.method == 'POST':
            return [permissions.IsAuthenticated(), RestrictTo(['landlord'])]
        return [permissions.AllowAny()]

    @action(methods=['GET', 'POST'], detail=True, url_path='comments')
    def comments(self, request, pk=None):
        if request.method == 'GET':
            comments = self.get_object().commentaccommodation_set.select_related('user').all()
            return Response(serializers.CommentAccommodationSerializer(comments, many=True).data,
                            status=status.HTTP_200_OK)
        elif request.method == 'POST':
            c = self.get_object().commentaccommodation_set.create(content=request.data.get('content'),
                                                                  user=request.user)
            return Response(serializers.CommentAccommodationSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='like', detail=True)
    def like(self, request, pk):
        li, created = LikeAccommodation.objects.get_or_create(post_accommodation=self.get_object(),
                                                              user=request.user)

        if not created:
            li.active = not li.active
            li.save()

        return Response(serializers.LikeAccommodationSerializer(li).data,
                        status=status.HTTP_201_CREATED)

    @action(methods=['POST'], url_path='review', detail=True)
    def review(self, request, pk):
        post = self.get_object()
        data = request.data
        review = data.get('review')
        if review not in ['Approved', 'Failed']:
            return Response({'error': 'Reivew must is Approved or Failed'}, status=status.HTTP_400_BAD_REQUEST)
        post.pending_status = review == 'Approved' and PendingStatus.APPROVED or PendingStatus.FAILED
        post.save()
        if review == 'Approved':
            Thread(target=send_mail, args=(post,)).start()
        return Response(serializers.PostAccommodationSerializer(post).data, status=status.HTTP_200_OK)

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            user_post = self.request.query_params.get('user_post')
            if user_post:
                queryset = queryset.filter(user_post__exact=user_post)
            district = self.request.query_params.get('district')
            if district:
                queryset = queryset.filter(district__icontains=district)

            city = self.request.query_params.get('city')
            if city:
                queryset = queryset.filter(city__icontains=city)

            max_people = self.request.query_params.get('max_people')
            if max_people:
                queryset = queryset.filter(max_people__gte=max_people)

            current_people = self.request.query_params.get('current_people')
            if current_people:
                queryset = queryset.filter(current_people__lte=current_people)

            min_price = self.request.query_params.get('min_price')
            if min_price:
                queryset = queryset.filter(price__gte=min_price)

            max_price = self.request.query_params.get('max_price')
            if max_price:
                queryset = queryset.filter(price__lte=max_price)

            pending_status = self.request.query_params.get('pending_status')
            if pending_status:
                queryset = queryset.filter(pending_status=pending_status)

            coordinates = self.request.query_params.get('coordinates')
            radius = self.request.query_params.get('radius')
            if coordinates and radius:
                try:
                    lat, lon = map(float, coordinates.split(','))
                    radius = float(radius)

                    def is_within_radius(accommodation):
                        acc_coord = (accommodation.latitude,
                                     accommodation.longitude)
                        distance = haversine(
                            (lat, lon), acc_coord, unit=Unit.METERS)
                        return distance <= radius
                    queryset = filter(is_within_radius, queryset)
                    queryset = list(queryset)
                except ValueError:
                    pass

        return queryset

    def create(self, request, *args, **kwargs):
        # Include user information in the data before validation
        request.data['owner'] = request.user.id
        request.data['user_post'] = request.user.id

        post_serializer = self.get_serializer(data=request.data)
        if not post_serializer.is_valid():
            print(post_serializer.errors)
            return Response(post_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Check the number of uploaded images
        images = request.FILES.getlist('images')
        if len(images) < 3:
            return Response({'error': 'At least three images are required'}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_image_urls = []
        for image_file in images:
            try:
                upload_result = cloudinary.uploader.upload(image_file)
                uploaded_image_urls.append(upload_result['secure_url'])
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Save the post and images to the database only if all images are uploaded successfully
        post = post_serializer.save(owner=request.user, user_post=request.user)
        for url in uploaded_image_urls:
            AccommodationImage.objects.create(
                image=url, post_accommodation=post)

        response_data = {
            'post': post_serializer.data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Get the list of existing image URLs and new images
        existing_images = request.data.getlist('existing_images', [])
        new_images = request.FILES.getlist('new_images', [])
        print(f"existing_images: {existing_images}")
        print(f"new_images: {new_images}")
        # Handle existing images (keep only those which are still included in the request)
        instance_images_urls = [
            image.image.url for image in instance.images.all()]
        print(f"instance_images_urls: {instance_images_urls}")
        images_to_remove = list(
            set(instance_images_urls) - set(existing_images))
        print(f"images_to_remove: {images_to_remove}")
        # Remove images from Cloudinary
        # for image_url in images_to_remove:
        #     print(f"image_url: {image_url}")
        #     public_id = image_url.split('/')[-1].split('.')[0]
        #     try:
        #         cloudinary.uploader.destroy(public_id)
        #     except Exception as e:
        #         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Remove the images from the database
        for image_url in images_to_remove:
            instance.images.filter(image__startswith=f"{image_url}.").delete()

        instance_images_urls = [
            image.image.url for image in instance.images.all()]
        print(f"instance_images_urls after deletion: {instance_images_urls}")
        # Upload new images
        uploaded_image_urls = []
        for image_file in new_images:
            try:
                upload_result = cloudinary.uploader.upload(image_file)
                uploaded_image_urls.append(upload_result['secure_url'])
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        print(f"uploaded_image_urls: {uploaded_image_urls}")

        # Update the instance with new data
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        if serializer.is_valid():
            post = serializer.save()

            # Update the images in the database
            for url in uploaded_image_urls:
                AccommodationImage.objects.create(
                    image=url, post_accommodation=post)

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.active = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
