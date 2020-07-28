const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sanitizeHtml = require('sanitize-html');
const { GMAIL_USER, GMAIL_PASS, GMAIL_REFRESH_TOKEN, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, JWT_SECRET, MAIL_FROM, SERVER_URL } = process.env;

const oauth2Client = new OAuth2(
  GMAIL_CLIENT_ID, // ClientID
  GMAIL_CLIENT_SECRET, // Client Secret
  'https://developers.google.com/oauthplayground' // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: GMAIL_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken();

/**
 * Sends a email verification link to the supplied email
 * @param {string} email - User email
 * @param {string} username - User name
 * @param {string} code - Verification code
 */
const sendEmailVerification = async (email, username, code) => {
  try {
    // SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken
      }
    });
    // Create HTML to send in email
    const verifyLink = `${SERVER_URL}/api/users/email-verification/${username}/${code}`;
    const htmlBody = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width" name="viewport"/>
<!--[if !mso]><!-->
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--<![endif]-->
<title>Email verification - EasyList.link</title>
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"/>
<!--<![endif]-->
<style type="text/css">
		body {
			margin: 0;
			padding: 0;
		}

		table,
		td,
		tr {
			vertical-align: top;
			border-collapse: collapse;
		}

		* {
			line-height: inherit;
		}

		a[x-apple-data-detectors=true] {
			color: inherit !important;
			text-decoration: none !important;
		}
	</style>
<style id="media-query" type="text/css">
		@media (max-width: 520px) {

			.block-grid,
			.col {
				min-width: 320px !important;
				max-width: 100% !important;
				display: block !important;
			}

			.block-grid {
				width: 100% !important;
			}

			.col {
				width: 100% !important;
			}

			.col>div {
				margin: 0 auto;
			}

			img.fullwidth,
			img.fullwidthOnMobile {
				max-width: 100% !important;
			}

			.no-stack .col {
				min-width: 0 !important;
				display: table-cell !important;
			}

			.no-stack.two-up .col {
				width: 50% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num8 {
				width: 66% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num3 {
				width: 25% !important;
			}

			.no-stack .col.num6 {
				width: 50% !important;
			}

			.no-stack .col.num9 {
				width: 75% !important;
			}

			.video-block {
				max-width: none !important;
			}

			.mobile_hide {
				min-height: 0px;
				max-height: 0px;
				max-width: 0px;
				display: none;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide {
				display: block !important;
				max-height: none !important;
			}
		}
	</style>
</head>
<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: transparent;">
<!--[if IE]><div class="ie-browser"><![endif]-->
<table bgcolor="transparent" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top;" valign="top">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:transparent"><![endif]-->
<div style="background-color:transparent;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;background-color:#F8E9FC;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
<div style="background-color:#F8E9FC;width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth fullwidth" style="padding-right: 60px;padding-left: 60px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 60px;padding-left: 60px;" align="center"><![endif]-->
<div style="font-size:1px;line-height:60px"> </div><img align="center" alt="Image" border="0" class="center autowidth fullwidth" src="https://github.com/chadpjontek/resources/raw/master/images/easylist-logo.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 380px; display: block;" title="Image" width="380"/>
<div style="font-size:1px;line-height:60px"> </div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 60px; padding-left: 60px; padding-top: 60px; padding-bottom: 60px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#000;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:60px;padding-right:60px;padding-bottom:60px;padding-left:60px;">
<div style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.2; color: #000; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; text-align: center; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 18px;">Hi <strong>${username}</strong>! Your account has been created. Please <strong><a href="${verifyLink}">CLICK HERE</a></strong> to verify your email.</span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if (IE)]></div><![endif]-->
</body>
</html>`;
    // setup mail options
    const mailOptions = {
      from: MAIL_FROM, // sender address
      to: email,
      subject: 'Verify your account',
      text: `Your account has been created. Please visit ${verifyLink} to verify your email.`, // plain text body
      html: htmlBody
    };
    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Sends a password recovery link to the supplied email
 * @param {string} email - User email
 * @param {string} username - Username
 * @param {string} code - Recovery code
 */
const sendPasswordRecoveryEmail = async (email, username, code) => {
  try {
    // SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken
      }
    });

    // Create HTML to send in email
    const pwResetLink = `${SERVER_URL}/api/users/password-recovery/${username}/${code}`;
    const htmlBody = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width" name="viewport"/>
<!--[if !mso]><!-->
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--<![endif]-->
<title>Password Reset - EasyList.link</title>
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"/>
<!--<![endif]-->
<style type="text/css">
		body {
			margin: 0;
			padding: 0;
		}

		table,
		td,
		tr {
			vertical-align: top;
			border-collapse: collapse;
		}

		* {
			line-height: inherit;
		}

		a[x-apple-data-detectors=true] {
			color: inherit !important;
			text-decoration: none !important;
		}
	</style>
<style id="media-query" type="text/css">
		@media (max-width: 520px) {

			.block-grid,
			.col {
				min-width: 320px !important;
				max-width: 100% !important;
				display: block !important;
			}

			.block-grid {
				width: 100% !important;
			}

			.col {
				width: 100% !important;
			}

			.col>div {
				margin: 0 auto;
			}

			img.fullwidth,
			img.fullwidthOnMobile {
				max-width: 100% !important;
			}

			.no-stack .col {
				min-width: 0 !important;
				display: table-cell !important;
			}

			.no-stack.two-up .col {
				width: 50% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num8 {
				width: 66% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num3 {
				width: 25% !important;
			}

			.no-stack .col.num6 {
				width: 50% !important;
			}

			.no-stack .col.num9 {
				width: 75% !important;
			}

			.video-block {
				max-width: none !important;
			}

			.mobile_hide {
				min-height: 0px;
				max-height: 0px;
				max-width: 0px;
				display: none;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide {
				display: block !important;
				max-height: none !important;
			}
		}
	</style>
</head>
<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: transparent;">
<!--[if IE]><div class="ie-browser"><![endif]-->
<table bgcolor="transparent" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top;" valign="top">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:transparent"><![endif]-->
<div style="background-color:transparent;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;background-color:#F8E9FC;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
<div style="background-color:#F8E9FC;width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth fullwidth" style="padding-right: 60px;padding-left: 60px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 60px;padding-left: 60px;" align="center"><![endif]-->
<div style="font-size:1px;line-height:60px"> </div><img align="center" alt="Image" border="0" class="center autowidth fullwidth" src="https://github.com/chadpjontek/resources/raw/master/images/easylist-logo.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 380px; display: block;" title="Image" width="380"/>
<div style="font-size:1px;line-height:60px"> </div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 60px; padding-left: 60px; padding-top: 60px; padding-bottom: 60px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#000;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:60px;padding-right:60px;padding-bottom:60px;padding-left:60px;">
<div style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.2; color: #000; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; text-align: center; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 18px;">Hi <strong>${username}</strong>! You can reset your password now. Please <strong><a href="${pwResetLink}">CLICK HERE</a></strong> to be taken to the new password creation screen.</span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if (IE)]></div><![endif]-->
</body>
</html>`;

    // setup mail options
    const mailOptions = {
      from: MAIL_FROM, // sender address
      to: email,
      subject: 'Reset your password',
      text: `You can reset your password now. Please visit ${pwResetLink} to be taken to the new password creation screen.`, // plain text body
      html: htmlBody
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Send a list completion email notification
 * @param {string} listName - name of list
 * @param {string} email - User email
 * @param {string} username - Username
 * @param {string} finishedBy - name of user who finished list
 */
const sendListCompletionNotification = async (listName, email, username, finishedBy) => {
  try {
    // SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken
      }
    });

    // Create HTML to send in email
    const htmlBody = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width" name="viewport"/>
<!--[if !mso]><!-->
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--<![endif]-->
<title>${listName} has been completed by ${finishedBy}!</title>
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"/>
<!--<![endif]-->
<style type="text/css">
		body {
			margin: 0;
			padding: 0;
		}

		table,
		td,
		tr {
			vertical-align: top;
			border-collapse: collapse;
		}

		* {
			line-height: inherit;
		}

		a[x-apple-data-detectors=true] {
			color: inherit !important;
			text-decoration: none !important;
		}
	</style>
<style id="media-query" type="text/css">
		@media (max-width: 520px) {

			.block-grid,
			.col {
				min-width: 320px !important;
				max-width: 100% !important;
				display: block !important;
			}

			.block-grid {
				width: 100% !important;
			}

			.col {
				width: 100% !important;
			}

			.col>div {
				margin: 0 auto;
			}

			img.fullwidth,
			img.fullwidthOnMobile {
				max-width: 100% !important;
			}

			.no-stack .col {
				min-width: 0 !important;
				display: table-cell !important;
			}

			.no-stack.two-up .col {
				width: 50% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num8 {
				width: 66% !important;
			}

			.no-stack .col.num4 {
				width: 33% !important;
			}

			.no-stack .col.num3 {
				width: 25% !important;
			}

			.no-stack .col.num6 {
				width: 50% !important;
			}

			.no-stack .col.num9 {
				width: 75% !important;
			}

			.video-block {
				max-width: none !important;
			}

			.mobile_hide {
				min-height: 0px;
				max-height: 0px;
				max-width: 0px;
				display: none;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide {
				display: block !important;
				max-height: none !important;
			}
		}
	</style>
</head>
<body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: transparent;">
<!--[if IE]><div class="ie-browser"><![endif]-->
<table bgcolor="transparent" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top;" valign="top">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:transparent"><![endif]-->
<div style="background-color:transparent;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;background-color:#F8E9FC;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
<div style="background-color:#F8E9FC;width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<div align="center" class="img-container center autowidth fullwidth" style="padding-right: 60px;padding-left: 60px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 60px;padding-left: 60px;" align="center"><![endif]-->
<div style="font-size:1px;line-height:60px"> </div><img align="center" alt="Image" border="0" class="center autowidth fullwidth" src="https://github.com/chadpjontek/resources/raw/master/images/easylist-logo.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 380px; display: block;" title="Image" width="380"/>
<div style="font-size:1px;line-height:60px"> </div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 60px; padding-left: 60px; padding-top: 60px; padding-bottom: 60px; font-family: Arial, sans-serif"><![endif]-->
<div style="color:#000;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:1.2;padding-top:60px;padding-right:60px;padding-bottom:60px;padding-left:60px;">
<div style="font-family: 'Open Sans', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.2; color: #000; mso-line-height-alt: 14px;">
<p style="font-size: 14px; line-height: 1.2; text-align: center; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 18px;">Hi <strong>${username}</strong>! Your list, <strong>${listName}</strong>, has just been completed by <strong>${finishedBy}</strong>!</span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
</div>
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
</td>
</tr>
</tbody>
</table>
<!--[if (IE)]></div><![endif]-->
</body>
</html>`;

    // setup mail options
    const mailOptions = {
      from: MAIL_FROM, // sender address
      to: email,
      subject: `${listName} has been completed by ${finishedBy}!`,
      text: `Your list, ${listName}, has just been completed by ${finishedBy}!`, // plain text body
      html: htmlBody
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Create a JWT for a user.
 * @param {User} user - User object to create JWT for.
 */
const signToken = user => {
  return jwt.sign({ issuer: 'issuer', subject: user.id }, JWT_SECRET, { expiresIn: '1d' });
};

/**
  * A function to return a bcrypt hash from a give value.
  * @param {string} value - The value to be hashed
  */
const createHash = async (value) => {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // return hash
    return await bcrypt.hash(value, salt);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Update user password.
 * @param {User} user - The user to update password on.
 * @param {string} newPassword - The new password to be set.
 */
const updatePassword = async (user, newPassword) => {
  try {
    user.password = await createHash(newPassword);
    await user.save();
  } catch (error) {
    console.log(error);
  }
};

const cleanHTML = (html) => {
  const clean = sanitizeHtml(html, {
    allowedTags: ['b', 'i', 'ol', 'ul', 'li', 'a', 'br'],
    allowedAttributes: {
      'a': ['href']
    }
  });
  return clean;
};

module.exports = {
  sendEmailVerification,
  sendPasswordRecoveryEmail,
  sendListCompletionNotification,
  signToken,
  createHash,
  updatePassword,
  cleanHTML
};