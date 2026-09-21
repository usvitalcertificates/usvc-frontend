export interface FaqItem {
  question: string;
  answer: string;
}

const HEALTH = "The State's Department of Health Statistics";
const CDC_URL = "https://www.cdc.gov/nchs/w2w/index.htm";

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I obtain the status of my order?",
    answer: "Please [Contact Us](/contact) for an update on your order.",
  },
  {
    question: "Can I change information on my order?",
    answer:
      "If you have submitted incorrect information, please [Contact Us](/contact) as soon as possible.",
  },
  {
    question: "What is included in my payment?",
    answer:
      "USVC collects one all-inclusive payment. Each copy includes the USVC Processing Fee and a fixed Government / Agency Fee & Shipping bundle based on domestic or international delivery. Optional Rush Processing is charged once per order. Your complete total is shown before payment, and no second customer payment is required for the order.",
  },
  {
    question: "How much does it cost to order a vital record and what type of payment is accepted?",
    answer:
      "To find the cost of your order, select the relevant state and the vital certificate type (birth, death, marriage or divorce). The payment information is provided on that page, including additional certificates.\n\nWe accept payment by Visa, Mastercard, and debit credit cards.",
  },
  {
    question: "Can I cancel and/or get a refund?",
    answer:
      "We are a service oriented business, committed to the highest quality in customer service. We cannot provide refunds or cancel an application for any of our services as all vital record applications are reviewed and processed upon receipt. However, in some cases we do make exceptions to this policy.",
  },
  {
    question:
      "Is the certificate an official document and can it be used for a passport application?",
    answer:
      "Yes. All certificates ordered through this website are certified photocopies of the original record with the embossed seal from the state issued and can typically be used for travel, passport, proof of citizenship, social security, driver's license, school registration, personal identification, and other legal purposes.",
  },
  {
    question: "How do I find information provided on a vital record?",
    answer: `Please contact [${HEALTH}](${CDC_URL})`,
  },
  {
    question:
      "Name misspelled or incorrect information on birth, death, marriage or divorce vital certificate?",
    answer: `Please contact [${HEALTH}](${CDC_URL})`,
  },
  {
    question:
      "I mailed my order form and/or paid by check or money order. How do I obtain a status update?",
    answer: `Please contact [${HEALTH}](${CDC_URL}) if you have mailed your order form and/or provided a check or money order, you have not used our services. All orders we receive are submitted online. We do not have an option to receive mailed applications.`,
  },
  {
    question: "How can I add the Father to the birth registration?",
    answer: `Please contact [${HEALTH}](${CDC_URL})`,
  },
  {
    question: "Can I pick my vital certificate up in person?",
    answer:
      "Although we do not offer a walk-in service our safe and easy online order form allows you to request your vital certificate in less than 10 minutes.",
  },
  {
    question:
      "How long will it take to receive my vital certificate and how many copies can I obtain?",
    answer:
      "Processing and delivery times vary by state and certificate type. Detailed delivery times are listed on the order form. Depending on the state and certificate type you may request a minimum of 1 to a maximum of 20 certificates at one time. Additional fees apply per copy ordered.",
  },
  {
    question: "Adoption – What last name do I use?",
    answer:
      "If the last name was legally changed to the adoptive parent's name use that name, unless there has been a legal name change after adoption.",
  },
  {
    question: "What is a maiden name or legal name change?",
    answer:
      "A maiden name is your last name at birth. If you have had a legal name change your original vital records would have been permanently changed either by yourself or the courts. Your new legal name would be your new maiden name. Taking your spouse's last name is not a legal name change and would not have altered your original birth vital record.",
  },
  {
    question: "How do I make a legal name change?",
    answer: `Please contact [${HEALTH}](${CDC_URL})`,
  },
  {
    question: "How do I update my birth certificate after a legal name change?",
    answer: `In most situations the Court will file the documents for you which will be automatically transferred to your original vital record of birth. However, there are states that you will receive a certified copy of the order from the judge or magistrate and will be required to update your own vital record of birth. Any further questions regarding your legal name change please contact [${HEALTH}](${CDC_URL}) of the state you legally changed your name.`,
  },
  {
    question: "Is the time of birth on the certificate?",
    answer: `As time of birth is not necessarily registered with the government you may wish to contact the hospital the birth occurred in. If that is unsuccessful you may wish to contact [${HEALTH}](${CDC_URL})`,
  },
  {
    question: "Looking for birth parents before adoption?",
    answer: `Please contact [${HEALTH}](${CDC_URL})`,
  },
  {
    question: "The type of certificate I need is not listed, who should I contact?",
    answer: `There are states on this website that not all vital certificate types are available at this time. Please contact [${HEALTH}](${CDC_URL}) they will be able to assist you.`,
  },
  {
    question: "If my relationship to the Subject is not on the order form, who should I contact?",
    answer: `Please contact [${HEALTH}](${CDC_URL}). If your relationship is not on the order form, you may not be eligible to apply.`,
  },
  {
    question:
      "If the date of birth, death, marriage or divorce is not listed, who should I contact?",
    answer: `Please contact [${HEALTH}](${CDC_URL}) they will be able to assist you.`,
  },
  {
    question: "How do I get a vital certificate with ‘Cause of Death’?",
    answer: `Please contact [${HEALTH}](${CDC_URL}) they will be able to assist you.`,
  },
  {
    question: "How do I verify the death of next of kin?",
    answer: `Please contact [${HEALTH}](${CDC_URL})`,
  },
  {
    question: "Can I get a copy of my vital certificate faxed or emailed to me?",
    answer: "No. Vital records offices do not fax or email certificates.",
  },
  {
    question: "Has the birth, death, marriage or divorce been registered?",
    answer: `To find out if it is registered please contact [${HEALTH}](${CDC_URL}) they will be able to assist you.`,
  },
  {
    question: "What's the difference between a marriage certificate and a marriage license?",
    answer:
      "A marriage certificate is a legal document that provides proof that a couple are already married. A marriage license is the permission required by law to get married.",
  },
  {
    question: "What do I do if my certificate has been stolen?",
    answer: `Please contact [${HEALTH}](${CDC_URL}) regarding this matter.`,
  },
  {
    question: "How do I access Archived records?",
    answer: `Please contact [${HEALTH}](${CDC_URL})`,
  },
  {
    question: "What if I don’t have all the required information to complete the order form?",
    answer: `The government agency issuing your certificate requires certain information to process your request. If you are unable to get the information required, you may wish to discuss this in person or by mail with [${HEALTH}](${CDC_URL})\n\nCity not listed: Based on information from the United States Postal Service, some cities no longer exist and they may have been replaced with a new name or joined with a neighboring city or town.\n\nIf the city where the event occurred is not listed in the drop-down list, you can use the link below to the [United States Postal Service](https://tools.usps.com/go/ZipLookupAction!input.action) web site to verify if the city has changed their name or has joined with a neighboring city:\n\n1. Enter the city and the two letter state abbreviation.\n2. Click on the submit button.\n\nCounty not listed: One helpful online resource in narrowing your search is [Zipinfo.com's Free Zip Code Lookup](http://www.zipinfo.com/search/zipcode.htm). Follow the instructions below:\n\n1. Click on the box that says "county name and FIPS code".\n2. Enter the city and the state below in the field below (i.e. Buffalo, NY).\n3. Click "go".\n\nThe county and other details will be displayed on the following page.`,
  },
];

export function faqAnswerToPlainText(answer: string): string {
  return answer
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}
