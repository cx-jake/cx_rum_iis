// cx.js
document.addEventListener('DOMContentLoaded', function() {
  // Access the global CoralogixRum object provided by the CDN
  CoralogixRum.init({
    public_key: '<CX_API_KEY>>',
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