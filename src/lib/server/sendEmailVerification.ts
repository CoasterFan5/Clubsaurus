import { EMAIL_ADDRESS } from '$env/static/private';
import { secureTokensTable, type usersTable } from './db/schema';
import crypto from 'crypto';
import { mailTransit } from './mail';
import { db } from './db';
import { and, eq, gt } from 'drizzle-orm';

const TEN_MINUTES = 10 * 60 * 1000;

/**
Send a verification email to the user, will return an error if it can't be sent
@param user - The user
@param hostPath - https://host.path.com
*/
export const sendEmailVerificationEmail: (
	user: typeof usersTable.$inferSelect,
	hostPath: URL
) => Promise<
	| {
			success: false;
			error: 'TIME';
	  }
	| {
			success: true;
	  }
> = async (user, hostPath) => {
	const emailVerificationToken = crypto.randomBytes(128).toString('base64url');

	const tokenCheck = await db
		.select()
		.from(secureTokensTable)
		.where(
			and(
				eq(secureTokensTable.type, 'emailVerification'),
				eq(secureTokensTable.issuedByUserId, user.id),
				gt(secureTokensTable.created, new Date(Date.now() - TEN_MINUTES))
			)
		);

	if (tokenCheck.length > 0) {
		return {
			success: false,
			error: 'TIME'
		};
	}

	await db.insert(secureTokensTable).values({
		token: emailVerificationToken,
		type: 'emailVerification',
		issuedByUserId: user.id
	});

	const verifyUrl = new URL(`/verifyEmail/${emailVerificationToken}`, hostPath).toString();

	await mailTransit.sendMail({
		from: EMAIL_ADDRESS,
		to: user.email,
		subject: 'Verify Clubsaurus Email!',
		text: `Verify with this link: ${verifyUrl}`,
		html: getEmailHtmlContent(verifyUrl)
	});

	return {
		success: true
	};
};

// Long function that controls email html
const getEmailHtmlContent = (verifyUrl: string) => {
	return `<table
  cellpadding="0"
  cellspacing="0"
  border="0"
  width="100%"
  style="border-collapse: collapse"
>
  <tr>
    <td>
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="600"
        style="
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        "
        class="container"
      >
        <tr>
          <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px">
            <table
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="100%"
              style="border-collapse: collapse"
            >
              <tr>
                <td
                  style="
                    color: #153643;
                    font-family: Arial, sans-serif;
                    font-size: 24px;
                  "
                >
                  <b style="font-weight: bold">Email Verification!</b>
                </td>
              </tr>
              <tr>
                <td
                  style="
                    padding: 20px 0 30px 0;
                    color: #153643;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    line-height: 20px;
                  "
                >
                  <p style="margin: 0">Hello,</p>
                  <p style="margin: 20px 0 0 0">
                    An account was recently created with this email, if this
                    wasn't you, please check your email inbox security, and then
                    you may safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <a
                    href="${verifyUrl}"
                    style="
                      background-color: #ff4b00;
                      border: none;
                      color: white;
                      padding: 15px 32px;
                      text-align: center;
                      text-decoration: none;
                      display: inline-block;
                      font-size: 16px;
                      border-radius: 5px;
                      font-family: Arial, sans-serif;
                    "
                    >Verify</a
                  >
                </td>
              </tr>
              <tr>
                <td
                  style="
                    font-family: Arial, sans-serif;
                    padding-top: 15px;
                    font-size: 12px;
                  "
                >
                  Pst! if that button didn't work, copy and paste this link:
                  <a href="${verifyUrl}" style="color: #ff4b00">${verifyUrl}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;
};
