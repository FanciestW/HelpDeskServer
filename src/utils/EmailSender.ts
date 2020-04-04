import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an Email with the ticket assignment template.
 * @param email The Email address to send the Email to.
 * @param name The name that will be included in the Email's body.
 */
export async function sendAssignedTicketEmail(email: string, name: string): Promise<any> {
  const msg = {
    to: email,
    from: 'helpdeskbot@williamlin.tech',
    templateId: 'd-7b4db3bb33ad421091fabad78302485d',
    dynamic_template_data: {
      name,
    },
  };
  try {
    return await sgMail.send(msg);
  } catch (err) {
    return err;
  }
}