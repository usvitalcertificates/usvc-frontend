export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const DOMAIN = "USVitalCertificates.org";
const SUPPORT_EMAIL = "support@usvitalcertificates.org";
const DISCLAIMER_FULL =
  "USVC is an independent service that assists individuals with requesting vital records from government agencies. We are not a government agency and are not affiliated with or endorsed by any federal or state office. Official records may be available directly from the issuing agency, potentially at a lower cost. Our fees cover online ordering, guided assistance, application review, and related processing support.";
const REVIEW_NOTE =
  "LEGAL REVIEW REQUIRED: This section contains placeholder language prepared for development purposes only. Final policy language must be reviewed and approved by a qualified attorney before launch.";

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "How USVC collects, uses, discloses, retains, and protects the personal information you provide when requesting a vital certificate.",
    lastUpdated: "May 19, 2025",
    sections: [
      {
        heading: "Introduction",
        body: [
          "By using this site, you consent to the terms of our privacy policy for the collection, use, and disclosure of your personal information for the purposes set out below. We do not collect, use or disclose your personal information for any other purpose than those identified below, except with your consent or as required by law.",
        ],
      },
      {
        heading: "What is personal information and what personal information do we collect?",
        body: [
          `Personal information is recorded information about an identifiable individual. Personal information that ${DOMAIN} collects, uses and discloses is only for the purpose of obtaining birth, marriage, death, and divorce certificates. The information we collect is based on the guidelines set out by the Vital Records agencies across the United States. Other information such as payment and additional contact information is collected strictly for the purpose of carrying out the requested services.`,
          `Below is an exhaustive list of the personal information that ${DOMAIN} may collect, use, and/or disclose. Not all of the following information will be collected with every application, but only as is required:`,
          "Applicant information:",
          "• First and last name",
          "• Mailing address",
          "• Phone numbers",
          "• Email address",
          "• Type of certificate required (Birth / Marriage / Death / Divorce)",
          "Subject(s) information:",
          "• Full legal name of subject(s)",
          "• Date of event",
          "• Place event occurred",
          "• Licensing county",
          "• Filing county",
          "• Spouse's full legal name (if applicable)",
          "Mother's information:",
          "• Maiden name (first, middle, and last name)",
          "Father's information:",
          "• Full legal name (if named at birth)",
          "• Reason certificate is required",
          "Payment information:",
          "• Type of credit card",
          "• Card number",
          "• Expiry date",
          "• Name of cardholder",
          "• The card security code",
        ],
      },
      {
        heading: "Why we collect and use personal information",
        body: [
          `${DOMAIN} collects, uses and discloses personal information only for the purposes of providing the requested services of ordering birth, marriage, death, and divorce certificates from the various Vital Records agencies across the United States. Our role is to submit applications for birth, marriage, death, and divorce certificates on your behalf, provided you meet the requirements of the issuing government agency. We are not a government agency.`,
          `Limits on collection, use, and disclosure: ${DOMAIN} will only collect, use and disclose personal information that is necessary to fulfill the requested services and in a manner required by law. We will not collect, use or disclose personal information except for the identified purposes unless ${DOMAIN} has received further consent from the individual, or as required by law.`,
        ],
      },
      {
        heading: "How we disclose personal information",
        body: [
          `For the purpose of our services, the information that we collect is submitted to the corresponding Vital Records agencies for obtaining vital certificates. ${DOMAIN} is not a government agency and as such does not hold or have access to any vital records. All certificates received are processed, printed and mailed from Vital Records directly to our clients. ${DOMAIN} collects personal information with the intention of submitting it to the corresponding Vital Records agency to assist in the application process of requesting vital certificates.`,
        ],
      },
      {
        heading: "How we obtain consent to collect, use, and disclose personal information",
        body: [
          `Where personal information is voluntarily submitted to ${DOMAIN} for the obvious purpose of requesting birth, marriage, death or divorce certificates, we will consider consent to be implied. However, ${DOMAIN} also obtains express consent with every application submitted for the purpose of disclosing personal information to the respective Vital Records agency. Your personal information will be used for no other purpose, commercial or otherwise, except where required by law.`,
        ],
      },
      {
        heading: "How long we retain personal information",
        body: [
          `${DOMAIN} will retain personal information for a minimum of four months as is required by law. Subject to the above-mentioned four month minimum, ${DOMAIN} will retain some information such as account and payment information for longer as is necessary to fulfill our business and legal requirements, to a maximum of seven years.`,
        ],
      },
      {
        heading: "How we keep personal information secure",
        body: [
          `${DOMAIN} has security measures in place to prevent against risks such as unauthorized access, collection, use, disclosure, copying, modification and disposal of personal information. These security measures include appropriate physical, electronic, and management procedures to ensure the safety and protection of your personal information.`,
        ],
      },
      {
        heading: "How we ensure that personal information is accurate",
        body: [
          `${DOMAIN} is committed to ensuring that the personal information we collect, use and/or disclose is accurate and complete. Whenever possible, ${DOMAIN} obtains information directly from our clients and not from other sources such as public resources available online. ${DOMAIN} cannot be held accountable for inaccurate or incomplete information that has been provided to us directly by our clients.`,
        ],
      },
      {
        heading:
          "How we provide individuals with access to their personal information under our control or custody",
        body: [
          `At any time individuals have the right to access their personal information that ${DOMAIN} has under its control and custody. All requests for access must be made in writing along with a photocopy of a piece of government-issued photo identification. ${DOMAIN} will only release information to the individual it pertains to.`,
          `At a request for information, ${DOMAIN} will provide individuals a copy of their personal information we hold, information about the ways in which their information has been used, and the names of the organizations to which their personal information has been disclosed. ${DOMAIN} will respond to all requests for information within 30 days after it has been requested. ${DOMAIN} will only refuse access to personal information where required by law. If ${DOMAIN} refuses an access request, you will be notified in writing stating the reasons for the refusal and provided with any further steps that are available to you.`,
        ],
      },
      {
        heading: "Correcting and updating your personal information",
        body: [
          `To review and update your personal information to ensure it is accurate, please contact us at ${SUPPORT_EMAIL} or through our contact page.`,
        ],
      },
      {
        heading: "Notification of privacy statement changes",
        body: [
          "We may update this privacy statement to reflect changes to our information practices. If we make any material changes we will notify you by email (sent to the email address specified in your order) or by means of a notice on this site prior to the change becoming effective. We encourage you to periodically review this page for the latest information on our privacy practices.",
        ],
      },
      {
        heading: "How individuals can ask questions, ask for access or make a complaint",
        body: [`For all other inquiries, contact us at ${SUPPORT_EMAIL}.`],
      },
      { heading: "Disclaimer", body: [DISCLAIMER_FULL] },
    ],
  },
  "terms-of-service": {
    slug: "terms-of-service",
    title: "Terms of Service",
    description:
      "The terms that apply when you use USVC to prepare, review, and submit a vital certificate request.",
    lastUpdated: "May 19, 2025",
    sections: [
      {
        heading: "1. Introduction and agreement to terms",
        body: [
          `This Terms and Conditions of Use Agreement ("Agreement") is by and between ${DOMAIN} ("USVC," "we," "us," or "our") and you ("you" or "your"). This Agreement governs your access to and use of the USVC website (the "Website") and its services (collectively, the "Service").`,
          "By clicking the order submission button or using any part of this Website, you agree you have read, understand, and are bound by this Agreement, including policies referenced herein (like our Privacy Policy). If you disagree, you must stop using the Website and Service immediately.",
          'USVC may change this Agreement. Material changes will be noted by updating the "Last Updated" date or by other appropriate means. Review this Agreement periodically. Continued use after changes means you accept the revised Agreement.',
        ],
      },
      {
        heading: "2. Privacy policy",
        body: [
          "Your privacy is important. Information submitted is subject to our Privacy Policy, which is part of this Agreement.",
        ],
      },
      {
        heading: "3. Electronic communications",
        body: [
          "Using our Service or sending us emails means you are communicating with us electronically. You consent to receive electronic communications from us (e.g., emails, website notices). You agree these satisfy legal requirements for written communication.",
        ],
      },
      {
        heading: "4. Description of service",
        body: [
          "USVC provides an online platform and application assistance service to help individuals prepare, review, and submit applications for official vital records from U.S. government agencies.",
          "You acknowledge:",
          "• USVC is a third-party application preparation and assistance service, acting as a liaison.",
          "• USVC is NOT a government agency and is not affiliated with or endorsed by any government entity.",
          "• You can obtain records directly from government agencies, possibly at a lower cost. Our Service offers convenience, expert assistance, and application review to enhance accuracy.",
          "• The disclosed order total contains USVC's value-added assistance fee (see Section 6). Government agency and shipping costs are charged separately upon State Agency review and acceptance.",
          "• USVC does not issue vital records; issuance is at the sole discretion of the government agency.",
          "• Use of information on this Website is at your own risk.",
        ],
      },
      {
        heading: "5. Eligibility and user responsibilities",
        body: [
          "5.1. Eligibility, authority, and lawful purpose. You must be at least 18 and able to form legally binding contracts. You warrant you are eligible under applicable state laws to request the vital records. If applying for another person (e.g., a minor), you warrant you have legal authority and necessary consents. You agree to provide proof of authority if required.",
          "5.2. Accuracy of information. You agree to provide true, accurate, current, and complete information. You are solely responsible for its accuracy. USVC is not liable for issues arising from inaccurate information you provide.",
          "5.3. User acknowledgements. You acknowledge:",
          "• Our service is generally rendered once your application is processed and submitted by us to the government agency.",
          "• Quoted processing and shipping times are estimates and subject to change due to external factors (government agencies, carriers) beyond our control.",
          "• You must promptly respond to requests for additional information.",
          "5.4. Use of third-party platforms. You authorize USVC to input your information into third-party state-affiliated or government-authorized platforms, or submit via other approved channels, as necessary to fulfill the Service.",
        ],
      },
      {
        heading: "6. Fees, payments, and taxes",
        body: [
          "Fees for our Service will be disclosed before you order. They typically include:",
          "• USVC service fee: for our application preparation, review, submission assistance, support, and operational costs, payable upon ordering.",
          "• Government agency fees and shipping: mandatory fees for the vital record, payable upon review and acceptance by the State Agency. These appear on your credit card statement separately from the USVC service fee.",
          "All fees are in U.S. Dollars. The USVC service total is disclosed before payment. USVC service fees for new orders are subject to change. State certificate fees are subject to change without notice. You warrant your payment information is accurate and authorized. You are responsible for applicable taxes.",
          "6.1. Service inactivity and potential additional fees. If your application remains incomplete on your part for an extended period (e.g., 45 days), causing verifications or information to expire, additional fees may be required to continue. You will be notified and may opt to pay or request a refund per our policy.",
        ],
      },
      {
        heading: "7. User conduct",
        body: [
          "You agree to comply with this Agreement and all applicable laws. You will not, nor assist others to:",
          "• Engage in fraudulent, unlawful, or abusive activities.",
          "• Submit false, misleading, or unauthorized information.",
          "• Impersonate others.",
          "• Use spam or automated means (robots, scrapers, etc.) to access the Website (except compliant search engines).",
          "• Interfere with the Service, or use viruses or disruptive technology.",
          "• Reverse engineer, modify, or resell the Service or Website content without authorization.",
          "• Collect user personal information without consent.",
        ],
      },
      {
        heading: "8. Cancellation and refund policy",
        body: [
          "USVC is committed to customer satisfaction.",
          "• Fee distinction: our service fee is for application assistance. Government agency and shipping fees are passed to those entities.",
          "• Cancellation and service fee refund (prior to agency submission): you may request cancellation and a full USVC service fee refund if your application has not yet been processed and submitted by us to the government agency. Contact client support immediately.",
          "• Service fee (after agency submission): generally non-refundable as our service is then rendered.",
          "• Service fee (non-performance/error by USVC): may be considered if USVC demonstrably fails its core service or a significant error on our part prevents agency acceptance. Reviewed individually.",
          "• Non-refundable circumstances (generally for all fees): refunds are typically not offered for agency delays or rejections (due to your ineligibility, incorrect information, etc.); shipping issues; your change of mind post-submission; discovering direct government application is cheaper; or your application errors.",
          "• Government/shipping fees: typically non-refundable by those entities (and thus us) once submitted or dispatched.",
          "• Requesting refunds/addressing issues: contact client support first with your order number and details. We urge direct contact before initiating a chargeback.",
          "• Chargebacks: you agree to this policy and to contact us before a chargeback. Our service fee is for services rendered upon application processing and submission. We reserve the right to dispute improper chargebacks. You may be responsible for associated costs.",
          "• Refund processing time: approved refunds typically within 7–10 business days.",
          "• Policy discretion: USVC may make exceptions in its sole discretion.",
        ],
      },
      {
        heading: "9. Intellectual property",
        body: [
          "The Website and its content (text, graphics, logos, software, etc.) are owned by USVC or its licensors and protected by intellectual property laws. Use of the Website is for your personal, non-commercial use related to the Service. You may not reproduce, distribute, or modify Website material without prior written consent, beyond incidental browser caching.",
        ],
      },
      {
        heading: "10. Third-party services and links",
        body: [
          "The Service may use or link to third-party sites and services (e.g., government agencies, payment processors) not controlled by USVC. We are not responsible for them. Access them at your own risk; this Agreement and our Privacy Policy do not apply. Their terms govern.",
        ],
      },
      {
        heading: "11. Disclaimers of warranties and limitations of liability",
        body: [
          '11.1. Service "as is." THE WEBSITE AND SERVICE ARE PROVIDED "AS IS" AND "AS AVAILABLE." USVC DOES NOT WARRANT THEY WILL BE UNINTERRUPTED, SECURE, ERROR-FREE, OR MEET YOUR REQUIREMENTS. ALL IMPLIED WARRANTIES (MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT) ARE DISCLAIMED, EXCEPT AS EXPRESSLY STATED.',
          "11.2. Third-party information. USVC IS NOT LIABLE FOR YOUR USE OF OR RELIANCE ON THIRD-PARTY SERVICES OR INFORMATION ACCESSED VIA THE WEBSITE.",
          "11.3. Limitation of liability. TO THE FULLEST EXTENT PERMITTED BY LAW, USVC AND ITS AFFILIATES ARE NOT LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES (INCLUDING LOST PROFITS OR DATA) ARISING FROM YOUR USE OF THE WEBSITE OR SERVICE.",
          "11.4. Liability cap. USVC'S AGGREGATE LIABILITY WILL NOT EXCEED THE USVC SERVICE FEE YOU PAID FOR THE SPECIFIC ORDER CAUSING LIABILITY. SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; SEEK LEGAL ADVICE IF APPLICABLE.",
        ],
      },
      {
        heading: "12. Indemnification",
        body: [
          "YOU AGREE TO INDEMNIFY, DEFEND, AND HOLD HARMLESS USVC AND ITS AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES, AND AGENTS (\"INDEMNIFIED PARTIES\") FROM ANY CLAIMS, DAMAGES, LOSSES, AND COSTS (INCLUDING REASONABLE ATTORNEYS' FEES) ARISING FROM YOUR BREACH OF THIS AGREEMENT, USE OF THE SERVICE, PURCHASE OR USE OF PRODUCTS, OR VIOLATION OF LAW OR THIRD-PARTY RIGHTS. USVC may control its defense at your cost. You will not settle claims without USVC's consent.",
        ],
      },
      {
        heading: "13. Termination or suspension of service",
        body: [
          "USVC may, in its sole discretion, without notice, suspend or terminate your access for any reason, including breach of this Agreement or harmful conduct.",
        ],
      },
      {
        heading: "14. Dispute resolution, governing law, and jurisdiction",
        body: [
          REVIEW_NOTE,
          "NOTICE OF ARBITRATION AGREEMENT AND CLASS ACTION WAIVER: UNLESS YOU OPT OUT AS PROVIDED BELOW, AND EXCEPT FOR CERTAIN DISPUTES (E.G., INTELLECTUAL PROPERTY, SMALL CLAIMS COURT), YOU AGREE THAT DISPUTES BETWEEN YOU AND USVC WILL BE RESOLVED BY BINDING, INDIVIDUAL ARBITRATION, WAIVING YOUR RIGHT TO A JURY TRIAL OR TO PARTICIPATE IN A CLASS ACTION.",
          "14.1. Initial dispute resolution. Contact client support first to resolve concerns. Parties shall attempt good faith negotiation before initiating formal proceedings.",
          "14.2. Governing law. This Agreement is governed by the laws of the State of Delaware, without regard to conflict of law principles. The UN Convention on Contracts for the International Sale of Goods does not apply.",
          "14.3. Jurisdiction. Unless subject to arbitration, legal actions shall be brought exclusively in courts located in San Diego County, California. You consent to this venue.",
          "14.4. Time limitation on claims. Claims must be brought within one (1) year after the cause of action accrues or be permanently barred.",
        ],
      },
      {
        heading: "15. Force majeure",
        body: [
          "USVC is not liable for delays or failures due to causes beyond its reasonable control (e.g., acts of God, war, terrorism, pandemics, strikes, power outages).",
        ],
      },
      {
        heading: "16. General provisions",
        body: [
          "16.1. Entire agreement: this Agreement (with the Privacy Policy and other legal notices) is the entire agreement between you and USVC regarding the Service.",
          "16.2. Severability: if any provision is invalid, the rest remain in effect.",
          "16.3. No waiver: failure to enforce any right is not a waiver.",
          "16.4. Assignment: you may not assign this Agreement. USVC may assign it without notice.",
          "16.5. Interpretation and headings: headings are for convenience. This Agreement is deemed drafted by both parties.",
          "16.6. Survivability: your representations, warranties, and indemnification obligations survive termination.",
          `16.7. Contact information: for questions about this Agreement, contact US Vital Certificates, Attn: Legal Department / Terms of Service, ${SUPPORT_EMAIL}.`,
        ],
      },
      { heading: "Disclaimer", body: [DISCLAIMER_FULL] },
    ],
  },
  accessibility: {
    slug: "accessibility",
    title: "Accessibility Statement",
    description:
      "USVC is committed to making its website usable by as many people as possible, including people using assistive technology.",
    lastUpdated: "Pending legal review",
    sections: [
      {
        heading: "Our commitment",
        body: [
          "We aim to follow the principles of the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA, including keyboard navigation, visible focus states, clear form labels, and adequate color contrast.",
        ],
      },
      {
        heading: "Ongoing work",
        body: [
          "Accessibility is an ongoing effort. We review the site as it changes and correct issues we identify.",
        ],
      },
      {
        heading: "Feedback",
        body: [
          `If you encounter a barrier on this website, please contact us at ${SUPPORT_EMAIL} and describe the page and the difficulty you experienced. We will work with you to provide the information you need.`,
        ],
      },
    ],
  },
};
