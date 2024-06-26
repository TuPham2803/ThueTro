import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from django.template.loader import render_to_string
from .models import Follow
from .serializers import PostAccommodationSerializer
from decouple import config
mailtrap_host = config('MAILTRAP_HOST')
mailtrap_port = config('MAILTRAP_PORT')
mailtrap_username = config('MAILTRAP_USERNAME')
mailtrap_password = config('MAILTRAP_PASSWORD')
mailtrap_sender = config('MAILTRAP_SENDER')


def send_mail(post_accommodation):
    # Retrieve the followers queryset
    followers = Follow.objects.filter(
        owner=post_accommodation.user_post).select_related('follower')

    for follow in followers:
        user = follow.follower
        post_data = PostAccommodationSerializer(post_accommodation).data

        # Render email content from template
        email_content = render_to_string(
            'mail/new_post.html', {"post_data": post_data, "user": user})

        # Send email
        with smtplib.SMTP(mailtrap_host, mailtrap_port) as server:
            server.login(mailtrap_username, mailtrap_password)

            msg = MIMEMultipart('alternative')
            msg['Subject'] = "New Post on RoomRental"
            msg['From'] = mailtrap_sender
            msg['To'] = user.email

            part1 = MIMEText(email_content, 'plain')
            part2 = MIMEText(email_content, 'html')

            msg.attach(part1)
            msg.attach(part2)
            server.sendmail(mailtrap_sender, user.email, msg.as_string())
