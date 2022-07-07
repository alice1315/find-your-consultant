# Find Your Consultant
Find your consultant is a platform that matches people looking for professional advice.

<img src="https://user-images.githubusercontent.com/29305102/173868322-7ca4082f-422a-450a-a508-bc7e56e7d60c.png" alt="image" width="1000">

</br>

# Demo
Website: https://findyourconsultant.online

</br>

# Test Account
There are two membership in Find Your Consultant. <br/>
'Regular member' is for people who are looking for advice, and 'consultant' is for people who could provide expert advice with professional fields.

</br>

| membership   |     Regular member    |       Consultant      |
| ------------ | --------------------- | --------------------- |
| email        | test_member@gmail.com | test_member@gmail.com |
| password     | test                  | test                  |  

</br>

|Credit card For test||
| ----------- | ---------------- |
| card number | 4242424242424242 |
| valid date  | 01/23            |
| cvv         | 123              |

</br>

# Main Features
1. SignUp & SignIn
- Uploading and managing files with AWS Simple Cloud Storge(S3) service.
- Using JSON Web Token(JWT) for authentication.
</br>

2. Professional fields filter
- Showing information about each consultant in different field.
<img width="600" alt="image" src="https://user-images.githubusercontent.com/29305102/173405630-4cd87c2f-60fd-48ce-ad47-0d2ddf338739.png"> 
</br>

3. Start consulting
- Using Socket.IO to build a real-time communication.
  * You could send and receive messages instantly.
  * Both could immediately receive the changed status.
</br>
<img src="https://user-images.githubusercontent.com/29305102/173410447-ec282f9c-29a9-40f8-829b-1aaf0c1bd02b.mp4" width="1000">
</br>
   

4. Make a payment
- Paying with credit card through the third-party cash flow service TapPay.
  * Regular member could pay to continue consulting.
</br>
<img src="https://user-images.githubusercontent.com/29305102/173412568-d49f8e0b-bda1-4569-8ee8-e232908da480.mp4" width="1000">
</br>
https://user-images.githubusercontent.com/29305102/173412568-d49f8e0b-bda1-4569-8ee8-e232908da480.mp4
  

5. End Case
- Reqular member could give some feedback to the consultant.
</br>

# Backend Architecture
<img src="https://user-images.githubusercontent.com/29305102/174129099-566f163d-1555-4963-9cdd-a6162d997b2a.png" alt="findyourc-30" width="600">
</br>

# Database Design (MySQL)
Reducing data redundancy through database normalization.
</br>
<img src="https://user-images.githubusercontent.com/29305102/174130101-1ef13b5a-6251-4c2a-96a4-f51eda0d2e3f.png" alt="MySQL-Diagram" width="600"/>
</br>


# RESTful API
<img src="https://user-images.githubusercontent.com/29305102/173632184-fdb803d7-2735-4923-9f3d-9dd457a64362.png" alt="RESTfulAPI" width="800"/>
</br>

# Backend Technique
Infrastructure
- Docker / Docker Compose

Environment
- Python Flask

Database
- MySQL

Cloud Services(AWS)
- EC2
- S3
- Cloud Front
- RDS

Networking
- HTTP & HTTPS
- Domain Name System(DNS)
- NGINX
- SSL (SSL For Free)
- WebSocket (Socket.IO)

Version Control System
- Git / GitHub

# Frontend Technique
- HTML
- CSS
- JavaScript
- AJAX

# Contact
Yun Chien Huang <br/>
Email: viento.a13@gmail.com
