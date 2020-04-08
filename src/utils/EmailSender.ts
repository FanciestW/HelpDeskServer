import nanoid from 'nanoid';
import sgMail from '@sendgrid/mail';
import EmailTransaction from '../models/EmailTransaction';
import EmailVerification from '../models/EmailVerification';
sgMail.setApiKey(process.env.SENGRID_API_KEY);

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
    const resEmail = await sgMail.send(msg);
    let emailTransactionId: string;
    do {
      emailTransactionId = nanoid(14);
    } while(await EmailTransaction.exists({ emailTransactionId }));
    await EmailTransaction.create({
      emailTransactionId,
      subject: 'Assigned Ticket Email',
      emailSentTo: assigneeEmail,
      triggeredBy: creatorEmail,
    });
    return resEmail;
  } catch (err) {
    return err;
  }
}

/**
 * Deletes all old email verification tokens and creates a new one and sends email verification email.
 * @param uid The uid of the user that needs email verification.
 * @param email The email to send the email verification email to.
 * @param name The name of the user to include in the email's body.
 * @param fqdn The Fully Qualifed Domain Name (www.example.com) that will be used in the verification link url.
 * @returns A Promise of the Sendgrid return object or an error if it fails.
 */
export async function sendVerificationEmail(uid: string, email: string, name: string, fqdn: string) {
  try {
    await EmailVerification.deleteMany({ uid, });
    let emailVerificationId;
    do {
      emailVerificationId = nanoid(14);
    } while (await EmailVerification.exists({ emailVerificationId }));
    const emailVerification = await EmailVerification.create({
      emailVerificationId,
      uid,
    });
    const verificationUrl = `http://${fqdn}/api/verify?token=${emailVerification.emailVerificationId}`;
    console.log(verificationUrl);
    const msg = {
      to: email,
      from: 'helpdeskbot@williamlin.tech',
      templateId: 'd-9ce5ca4b89114645b1f850f5e9ecd7c9',
      dynamic_template_data: {
        name,
        buttonUrl: verificationUrl,
      }
    };
    return await sgMail.send(msg);
  } catch (err) {
    return err;
  }
}