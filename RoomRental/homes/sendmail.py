import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from homes.models import Follow

mailtrap_host = "sandbox.smtp.mailtrap.io"
mailtrap_port = 2525
mailtrap_username = "ddfe90a83625e9"
mailtrap_password = "9a7e1248dd5c50"
mailtrap_sender = "roomrental@gmail.com"


def send_mail(post_accommodation):
    follows = Follow.objects.filter(
        owner=post_accommodation.user_post_id).select_related('follower').all()

    # Send email to all users
    with smtplib.SMTP(mailtrap_host, mailtrap_port) as server:
        server.login(mailtrap_username, mailtrap_password)
        for follows in follows:
            user = follows.follower
            email_content = f"""\
            <html>
            <body>
                <p>Hi {user.username},</p>
            </body>
            </html>
            """
            # Create message container
            msg = MIMEMultipart('alternative')
            msg['Subject'] = "New Post on RoomRental"
            msg['From'] = mailtrap_sender
            msg['To'] = user.email

            # Record the MIME types of both parts - text/plain and text/html.
            part1 = MIMEText(email_content, 'plain')
            part2 = MIMEText(email_content, 'html')

            # Attach parts into message container.
            msg.attach(part1)
            msg.attach(part2)
            server.sendmail(mailtrap_sender, user.email, msg.as_string())
