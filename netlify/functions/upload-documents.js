const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Parse form data
    const formData = JSON.parse(event.body);
    
    // Create email with attachments
    const email = {
      to: 'admin@liquidify.sg',
      from: 'admin@liquidify.sg',
      subject: `New Document Upload: ${formData.business_name}`,
      html: `
        <h2>📄 New Document Submission</h2>
        <p><strong>Business Name:</strong> ${formData.business_name}</p>
        <p><strong>WhatsApp Number:</strong> ${formData.whatsapp_number}</p>
        <p><strong>Documents Submitted:</strong></p>
        <ul>
          <li>✓ Bank Statements</li>
          <li>✓ Credit Bureau Report</li>
          <li>✓ Financial Statements</li>
          <li>✓ Notice of Assessment</li>
        </ul>
        <p><em>Reply to this email to confirm receipt with next steps.</em></p>
        <hr>
        <p><small>Liquidify | Business Financing Brokers | Singapore</small></p>
      `,
      attachments: formData.attachments || []
    };

    await sgMail.send(email);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Documents uploaded successfully! Check your WhatsApp for next steps.' 
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to upload documents. Please try again.' 
      })
    };
  }
};
