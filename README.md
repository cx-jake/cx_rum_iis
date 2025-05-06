# Simple IIS Web App with Coralogix RUM

This guide will walk you through setting up a simple "Hello World" web application using HTML and JavaScript and deploying it on an IIS server. Additionally, we'll integrate Coralogix Real User Monitoring (RUM) to monitor the application's performance.

## Prerequisites

- AWS Account
- Basic knowledge of AWS EC2 and IIS
- AWS CLI configured on your local machine

## Steps

### 1. Set Up an IIS Server on AWS

1. **Launch an EC2 Instance**:
   - Log in to your AWS Management Console.
   - Navigate to EC2 and click on "Launch Instance".
   - Choose the Windows Server 2019 Base AMI.
   - Select an instance type (e.g., t2.micro for free tier eligibility).
   - Configure instance details, add storage, and configure security groups to allow HTTP and RDP access.
   - Launch the instance and connect to it using RDP.

2. **Install IIS**:
   - Once connected to the instance, open "Server Manager".
   - Click on "Add roles and features" on the Dashboard.
   - Select "Web Server (IIS)" under the "Server Roles" section.
   - In "Features" select "IIS Hostable Web Core" and complete the installation.
   - Run 'iisreset' to ensure changes are applied.

### 2. Create a Simple HTML App with Coralogix RUM

1. **Create the HTML File**:
   - Create a file named `index.html` with the following content:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>Hello World</title>
         <script src="https://cdn.rum-ingress-coralogix.com/coralogix/browser/latest/coralogix-browser-sdk.js"></script>
         <script src="cx.js" defer></script>
     </head>
     <body>
         <h1>Hello, World!</h1>
     </body>
     </html>
     ```

2. **Create the JavaScript File for Coralogix RUM**:
   - Create a file named `cx.js` with the following content:
     ```javascript
     // cx.js
     document.addEventListener('DOMContentLoaded', function() {
       // Access the global CoralogixRum object provided by the CDN
       CoralogixRum.init({
         public_key: '<CX_API_KEY>',
         application: 'ec2-win',
         version: '1.0',
         coralogixDomain: 'US2',
         traceParentInHeader: {
           enabled: true,
           options: {
             propagateTraceHeaderCorsUrls: [new RegExp('.*')]
           }
         }
       });

       CoralogixRum.setUserContext({
         user_id: 'jake_meloche',
         user_name: 'jake',
         user_email: 'jake@meloche.com',
         user_metadata: {
           role: 'admin'
         }
       });

       CoralogixRum.setLabels({
         paymentMethod: 'visa',
         userTheme: 'black'
       });

       console.log('Coralogix RUM initialized successfully');
     });
     ```

### 3. Configure IIS to Host the HTML App

1. **Configure IIS**:
   - Open IIS Manager by clicking on the Start button, typing "IIS" or "Internet Information Services" in the search bar, and selecting "Internet Information Services (IIS) Manager" from the results.
   - In IIS Manager, right-click on "Sites" and select "Add Website...".
   - In the "Add Website" dialog:
     - Enter a name for your site in the "Site name" field.
     - Set the "Physical path" to the directory containing your `index.html` and `cx.js` files (e.g., `IIS Web App`).
     - Choose a port number for the site (default is 80 for HTTP).
   - Click "OK" to create the site.

2. **Configure MIME Types (if needed)**:
   - If you encounter issues with JavaScript files not being served correctly:
     - Select your site in the left-hand Connections pane.
     - Double-click on "MIME Types" in the middle pane.
     - Ensure there is an entry for `.js` with the MIME type `application/javascript`.
     - If the entry is missing, click "Add..." in the Actions pane and add it.

3. **Start the Site**:
   - Ensure the site is started by right-clicking on the site name and selecting "Manage Website" > "Start".

### 4. Test the Application

- Access the application via the public IP or DNS of your EC2 instance.
- Ensure the "Hello, World!" message is displayed.
- Use the browser's developer console to verify that Coralogix RUM is initialized successfully.

## Troubleshooting

If you encounter issues with your application:

1. **Check IIS Logs**:
   - IIS logs are typically located at `C:\inetpub\logs\LogFiles\W3SVC1\`.
   - Review these logs for any error messages related to your application.

2. **Browser Console**:
   - Open your browser's developer tools (typically by pressing F12).
   - Check the console for any JavaScript errors.

3. **MIME Types**:
   - Ensure that IIS is configured to serve JavaScript files correctly.

4. **File Permissions**:
   - Ensure that the IIS user (typically `IUSR`) has read permissions on your website files.

## Conclusion

You have successfully set up a simple HTML/JS web app on IIS and integrated Coralogix RUM for monitoring. For further customization and scaling, consider exploring more advanced AWS and IIS features. 

To verify the version of IIS on your server, you can use the following command:
```bash
reg query "HKLM\Software\Microsoft\InetStp" /v VersionString
``` 