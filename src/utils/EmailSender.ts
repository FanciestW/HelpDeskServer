import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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