import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from '$env/static/private';
import nodemailer from 'nodemailer';

export const mailTransit = nodemailer.createTransport(
	new URL(`smtp://${SMTP_USER}:${SMTP_PASS}@${SMTP_HOST}:${SMTP_PORT}/?pool`).toString()
);
