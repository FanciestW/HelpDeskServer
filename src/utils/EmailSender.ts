import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an Email with the ticket assignment template.
 * @param assigneeEmail The Email address of the assignee and the Email to send to.
 * @param creatorEmail The Email address of the creator.
 * @param creatorName The name of the ticket creator.
 * @param assigneeName The name of who was assigned the ticket.
 * @param ticketTitle The title of the ticket assigned.
 * @param ticketDescription The description of the ticket assigned.
 * @param url The URL that will take the user to the ticket details.
 * @returns A Promise of the Sendgrid return object or an error if it fails.
 */
export async function sendAssignedTicketEmail(
  assigneeEmail: string,
  creatorEmail: string,
  creatorName: string,
  assigneeName: string,
  ticketTitle: string,
  ticketDescription: string,
  buttonUrl: string
): Promise<any> {
  const msg = {
    to: assigneeEmail,
    from: 'helpdeskbot@williamlin.tech',
    templateId: 'd-7b4db3bb33ad421091fabad78302485d',
    dynamic_template_data: {
      creatorName,
      creatorEmail,
      assigneeName,
      ticketTitle,
      ticketDescription,
      buttonUrl,
    },
  };
  try {
    return await sgMail.send(msg);
  } catch (err) {
    return err;
  }
}