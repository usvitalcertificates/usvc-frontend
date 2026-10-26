/** Official-source research checked October 27, 2026. Each record has its own
 * authority, access, document distinction and routing notes; no fee/time promises.
 */
export const RECORD_GUIDE_DATA = {
  california: {
    name: "California",
    records: {
      death: {
        url: "https://www.cdph.ca.gov/Programs/CHSI/Pages/Vital-Records-Obtaining-Certified-Copies-of-Death-Records.aspx",
        authority: "California Department of Public Health and county recorders",
        record:
          "Choose an authorized or informational certified death copy according to its intended use.",
        access:
          "Authorized copies are limited to qualifying applicants; follow the official sworn-statement instructions.",
        route: "Use CDPH or the recorder for the county of death.",
        detail:
          "CDPH holds death records from July 1905. County holdings and recent-record availability can differ.",
        extra: [],
      },
      marriage: {
        url: "https://www.cdph.ca.gov/Programs/CHSI/Pages/Vital-Records-Obtaining-Certified-Copies-of-Marriage-Records.aspx",
        authority: "County recorder or county clerk; CDPH for indexed public marriages",
        record: "Public marriage copies and confidential marriage copies follow different routes.",
        access:
          "Follow the authorized-copy sworn-statement requirements. Confidential marriage copies require the county clerk’s separate process.",
        route:
          "Use the county recorder for public marriages or the county clerk for confidential marriages, where the license was issued.",
        detail:
          "CDPH has selected public-marriage years. Check its live coverage list; a missing state year does not mean the county has no record.",
        extra: [],
      },
      divorce: {
        url: "https://www.cdph.ca.gov/Programs/CHSI/Pages/Vital-Records-Obtaining-Certified-Copies-of-Divorce-Records.aspx",
        authority: "Superior Court in the county where the divorce case was filed",
        record:
          "A certified divorce judgment comes from the court. CDPH’s limited Certificate of Record does not establish that a divorce became final.",
        access:
          "Ask the court about access, certification and any restricted documents before requesting a case file.",
        route: "Request the final judgment from the Superior Court holding the case.",
        detail:
          "CDPH’s divorce index covers 1962 through June 1984 and provides a limited record, not the decree.",
        extra: [
          [
            "California Courts: copies of court records",
            "https://selfhelp.courts.ca.gov/court-basics/copy-record",
          ],
        ],
      },
    },
  },
  texas: {
    name: "Texas",
    records: {
      death: {
        url: "https://www.dshs.texas.gov/vital-statistics/death-records",
        authority: "Texas DSHS Vital Statistics and local registrars",
        record:
          "A certified death certificate and a death verification letter are different products.",
        access:
          "Check DSHS’s qualified-applicant and identification requirements for the record requested.",
        route: "Order through DSHS or the appropriate local registrar.",
        detail:
          "A death verification confirms selected facts and is not a legal replacement for the certified certificate.",
        extra: [
          ["Texas DSHS: record types", "https://www.dshs.texas.gov/vital-statistics/record-types"],
        ],
      },
      marriage: {
        url: "https://www.dshs.texas.gov/vital-statistics/marriage-divorce-records",
        authority: "County clerk where the license was filed",
        record: "DSHS issues a verification letter, not a certified marriage license.",
        access:
          "Confirm the clerk’s identification and access requirements; the state verification is a separate request.",
        route: "Request a certified copy from the county clerk where the license was filed.",
        detail:
          "State marriage verifications begin in 1966, subject to available index years. Verify that a letter is acceptable before paying for it.",
        extra: [
          ["Texas DSHS: record types", "https://www.dshs.texas.gov/vital-statistics/record-types"],
        ],
      },
      divorce: {
        url: "https://www.dshs.texas.gov/vital-statistics/marriage-divorce-records",
        authority: "District clerk where the divorce was granted",
        record: "DSHS issues a verification letter, not a certified divorce decree.",
        access:
          "Confirm the clerk’s identification and access requirements; the state verification is a separate request.",
        route: "Request a certified copy from the district clerk where the divorce was granted.",
        detail:
          "State divorce verifications begin in 1968, subject to available index years. Verify that a letter is acceptable before paying for it.",
        extra: [
          ["Texas DSHS: record types", "https://www.dshs.texas.gov/vital-statistics/record-types"],
        ],
      },
    },
  },
  florida: {
    name: "Florida",
    records: {
      death: {
        url: "https://www.floridahealth.gov/certificates-records/death-certificates/",
        authority: "Florida Bureau of Vital Statistics and county health departments",
        record: "Decide whether you need a death copy with or without cause of death.",
        access:
          "Recent cause-of-death information is restricted. Eligibility for the confidential copy differs from the copy without cause.",
        route:
          "Follow the Bureau’s or county health department’s death-certificate ordering instructions.",
        detail:
          "Florida protects cause-of-death information for deaths less than 50 years old. Social Security numbers remain confidential regardless of record age.",
        extra: [],
      },
      marriage: {
        url: "https://www.floridahealth.gov/certificates-records/marriage-certificates/",
        authority: "Florida Bureau of Vital Statistics and county clerks of court",
        record: "The state certificate is an abstract from the recorded marriage license.",
        access: "Use the current marriage application to confirm the details needed for a search.",
        route:
          "The Bureau covers marriages from June 6, 1927; contact the license-issuing county clerk for earlier records.",
        detail:
          "For a recent marriage not yet available at the Bureau, contact the clerk where the license was issued.",
        extra: [],
      },
      divorce: {
        url: "https://www.floridahealth.gov/certificates-records/divorce-certificates/",
        authority: "Florida Bureau of Vital Statistics; county clerk for the judgment",
        record:
          "A dissolution certificate summarizes the event; the full judgment is a separate court document.",
        access:
          "Florida dissolution certificates are public records; court-file access follows the clerk’s rules.",
        route:
          "For the complete judgment, contact the clerk in the county granting the dissolution.",
        detail:
          "State dissolution certificates cover recorded events from June 6, 1927. Ask the county clerk about earlier or newly finalized cases.",
        extra: [],
      },
    },
  },
  "new-york": {
    name: "New York",
    records: {
      death: {
        url: "https://www.health.ny.gov/vital_records/death.htm",
        authority: "New York State Department of Health outside NYC; NYC Health for city deaths",
        record: "State and New York City death certificates come from different offices.",
        access:
          "The state requires a qualifying relationship or documented legal need; check its applicant and ID instructions.",
        route:
          "Choose the office based on where the death occurred, including the separate NYC route.",
        detail:
          "The five NYC boroughs use the city process rather than the state death-certificate process.",
        extra: [["New York State: record jurisdiction", "https://www.health.ny.gov/vital_records"]],
      },
      marriage: {
        url: "https://www.health.ny.gov/vital_records/marriage",
        authority:
          "New York State Department of Health or the local license-issuing clerk; NYC City Clerk for city licenses",
        record:
          "Use the location where the marriage license was purchased to identify the record holder.",
        access:
          "Spouses qualify; other applicants need a documented proper purpose or the required court authorization.",
        route: "For a New York City license, use the City Clerk’s marriage-record service.",
        detail:
          "A marriage ceremony outside NYC does not by itself identify the license office. Check the original license location.",
        extra: [
          [
            "NYC City Clerk: marriage records",
            "https://www.cityclerk.nyc.gov/content/marriage-records",
          ],
        ],
      },
      divorce: {
        url: "https://www.health.ny.gov/vital_records/divorce",
        authority: "New York State Department of Health; county clerk for the judgment",
        record: "The divorce certificate and certified divorce judgment are different documents.",
        access:
          "The state certificate is available to either spouse or a person with a New York State court order.",
        route: "For the judgment, request a certified copy from the county clerk holding the case.",
        detail:
          "State divorce certificates cover divorces from 1963, including NYC. Earlier cases require the court route.",
        extra: [
          [
            "New York Courts: judgment process",
            "https://www.nycourts.gov/help/family-issues-divorce/judgment-uncontested-divorce",
          ],
        ],
      },
    },
  },
  pennsylvania: {
    name: "Pennsylvania",
    records: {
      death: {
        url: "https://www.pa.gov/agencies/health/programs/vital-records/death-certificates",
        authority: "Pennsylvania Department of Health, Division of Vital Records",
        record:
          "Use a certified death certificate for an official request; archival research copies serve a different purpose.",
        access:
          "Review the Department of Health’s eligible-applicant and identification instructions before applying.",
        route:
          "Use the state death-certificate service; ask the State Archives about historical research records.",
        detail:
          "Choose the official request route for the event and document you need rather than relying on an online historical index.",
        extra: [
          [
            "Pennsylvania: vital-record research",
            "https://www.pa.gov/agencies/phmc/pa-state-archives/research-online/vital-records",
          ],
        ],
      },
      marriage: {
        url: "https://www.pa.gov/agencies/phmc/pa-state-archives/research-online/vital-records/marriage-records",
        authority: "County Clerk of Orphans’ Court or marriage-license office",
        record: "The certified marriage record is held at county level.",
        access:
          "Ask the county office for its certified-copy request and identification instructions.",
        route: "Contact the county where the marriage license was issued.",
        detail:
          "Pennsylvania’s state vital-records office is not the source of certified marriage copies. An archival image does not replace a county certification.",
        extra: [],
      },
      divorce: {
        url: "https://www.pa.gov/agencies/phmc/pa-state-archives/research-online/vital-records/marriage-records",
        authority: "County court records office, typically the Prothonotary",
        record:
          "Request the court’s certified divorce decree rather than a state vital-record certificate.",
        access:
          "The court office determines access to case documents and certification requirements.",
        route:
          "Locate the county where the divorce was granted and contact its Prothonotary or court records office.",
        detail:
          "Pennsylvania keeps divorce records at county level; the state vital-records office does not issue the decree.",
        extra: [
          [
            "Philadelphia Courts: certified-copy instructions",
            "https://www.courts.phila.gov/pdf/forms/civil/Instructions-to-Obtain-Certified-Copies-of-documents.pdf",
          ],
        ],
      },
    },
  },
  illinois: {
    name: "Illinois",
    records: {
      death: {
        url: "https://dph.illinois.gov/topics-services/birth-death-other-records/death-records.html",
        authority: "Illinois Department of Public Health and county clerks",
        record: "Certified death copies serve legal purposes; uncertified copies are for research.",
        access:
          "Applicants need a personal or property-right interest. Nonrelatives must provide documentation of the need.",
        route: "Use IDPH’s death-record process or consult the county clerk.",
        detail: "IDPH requires readable, unexpired government photo ID with the application.",
        extra: [],
      },
      marriage: {
        url: "https://dph.illinois.gov/topics-services/birth-death-other-records/marriage-records.html",
        authority: "County clerk in the county of record",
        record: "IDPH can verify indexed facts, but does not issue the certified marriage record.",
        access:
          "State verifications require the prescribed application and valid photo ID; ask the clerk about certified copies.",
        route: "Obtain the certified copy from the county clerk holding the record.",
        detail:
          "IDPH verification coverage starts in 1962 and ends at its current index date. A verification is a different product from the clerk’s certified document.",
        extra: [],
      },
      divorce: {
        url: "https://dph.illinois.gov/topics-services/birth-death-other-records/dissolution-marriage-records.html",
        authority: "Circuit court clerk in the county of record",
        record:
          "IDPH can verify indexed facts, but does not issue the certified dissolution record.",
        access:
          "State verifications require the prescribed application and valid photo ID; ask the clerk about certified copies.",
        route: "Obtain the certified copy from the circuit court clerk holding the record.",
        detail:
          "IDPH verification coverage starts in 1962 and ends at its current index date. A verification is a different product from the clerk’s certified document.",
        extra: [],
      },
    },
  },
  ohio: {
    name: "Ohio",
    records: {
      death: {
        url: "https://www.cdc.gov/nchs/w2w/ohio.htm#death",
        authority: "Ohio Bureau of Vital Statistics and local vital-record offices",
        record: "Choose the certified death record rather than an index or obituary.",
        access:
          "Follow the current death application and any instructions for restricted information.",
        route:
          "Use the Bureau’s certificate service or consult the local office for the death location.",
        detail:
          "The Bureau’s death holdings begin in 1971. Check the official historical-record route for earlier deaths.",
        extra: [["CDC: Ohio record-office directory", "https://www.cdc.gov/nchs/w2w/ohio.htm"]],
      },
      marriage: {
        url: "https://www.cdc.gov/nchs/w2w/ohio.htm",
        authority: "County probate court",
        record: "Ohio’s state vital-statistics bureau does not maintain marriage records.",
        access: "Confirm the county court’s access and certified-copy instructions.",
        route: "Request the certified record from the county probate court.",
        detail:
          "The county holding the case or marriage record controls the request. A statewide birth/death application will not obtain this document.",
        extra: [],
      },
      divorce: {
        url: "https://www.cdc.gov/nchs/w2w/ohio.htm",
        authority: "Court clerk in the county where the divorce was finalized",
        record: "Ohio’s state vital-statistics bureau does not maintain divorce records.",
        access: "Confirm the county court’s access and certified-copy instructions.",
        route:
          "Request the certified record from the court clerk in the county where the divorce was finalized.",
        detail:
          "The county holding the case or marriage record controls the request. A statewide birth/death application will not obtain this document.",
        extra: [],
      },
    },
  },
  georgia: {
    name: "Georgia",
    records: {
      death: {
        url: "https://dph.georgia.gov/ways-request-vital-record/death",
        authority: "Georgia State Office of Vital Records and county vital-record offices",
        record: "A certified death copy is distinct from a research reference to the event.",
        access:
          "Applicants need a direct and tangible interest, such as qualifying family or legal representation.",
        route: "Follow the state death application or contact the county vital-record office.",
        detail: "State death records begin in January 1919. Some counties retain older records.",
        extra: [],
      },
      marriage: {
        url: "https://dph.georgia.gov/ways-request-vital-record/marriage",
        authority: "Georgia State Office of Vital Records or county Probate Office",
        record: "The marriage application, certificate and verification are different products.",
        access:
          "The certified application is limited to the two parties; confirm the requirements for the document requested.",
        route:
          "Use the Probate Office where the license was issued for records outside state holdings.",
        detail:
          "State application/certificate holdings run from June 1952 through August 1996. A separate state verification search covers marriages from January 1, 2014.",
        extra: [],
      },
      divorce: {
        url: "https://georgia.gov/request-vital-records",
        authority: "Clerk of Superior Court in the county granting the divorce",
        record: "A state confirmation is not the same as a certified court decree.",
        access: "Ask the Superior Court clerk about access and certified-copy requirements.",
        route: "Request the divorce record from the Superior Court holding the case.",
        detail: "Georgia DPH can confirm a divorce, but the court clerk holds the actual record.",
        extra: [],
      },
    },
  },
  "north-carolina": {
    name: "North Carolina",
    records: {
      death: {
        url: "https://vitalrecords.nc.gov/order.htm",
        authority: "North Carolina Vital Records and the county Register of Deeds",
        record:
          "Confirm whether you need a certified copy or a research copy before choosing a request route.",
        access: "Check the current certified-copy eligibility and identification instructions.",
        route: "Compare the state route with the county Register of Deeds.",
        detail:
          "State death holdings begin in 1930. For earlier death research, consult the State Archives.",
        extra: [
          [
            "NC Vital Records: holdings and older records",
            "https://vitalrecords.nc.gov/research.htm",
          ],
        ],
      },
      marriage: {
        url: "https://vitalrecords.nc.gov/order.htm",
        authority:
          "North Carolina Vital Records and the Register of Deeds where the license was issued",
        record:
          "Confirm whether you need a certified copy or a research copy before choosing a request route.",
        access: "Check the current certified-copy eligibility and identification instructions.",
        route: "Compare the state route with the Register of Deeds where the license was issued.",
        detail:
          "State marriage holdings begin in 1962. Marriage corrections go to the license-issuing Register of Deeds.",
        extra: [
          [
            "NC Vital Records: holdings and older records",
            "https://vitalrecords.nc.gov/research.htm",
          ],
        ],
      },
      divorce: {
        url: "https://vitalrecords.nc.gov/divorce.htm",
        authority:
          "North Carolina Vital Records and the Clerk of Court where the divorce was filed",
        record:
          "A divorce certificate summarizes the event; request the judgment from the court if its terms are needed.",
        access: "Check the current certified-copy eligibility and identification instructions.",
        route: "For a divorce judgment, use the county Clerk of Court.",
        detail:
          "State divorce holdings begin in 1958. Divorce corrections go to the Clerk of Court.",
        extra: [
          [
            "NC Vital Records: holdings and older records",
            "https://vitalrecords.nc.gov/research.htm",
          ],
          [
            "NC Courts: obtaining court records",
            "https://www.nccourts.gov/help-topics/court-records/obtaining-court-records",
          ],
        ],
      },
    },
  },
  michigan: {
    name: "Michigan",
    records: {
      death: {
        url: "https://www.michigan.gov/mdhhs/doing-business/vitalrecords/order-a-copy-of-a-vital-record",
        authority: "Michigan Division for Vital Records and Health Statistics",
        record:
          "Michigan offers certified copies and other record services; choose the product requested by the receiving office.",
        access:
          "Michigan lists no photo-ID requirement for standard certified death copies. Follow the selected product’s application requirements.",
        route:
          "Use the Michigan vital-record ordering service or ask the county clerk about local copies.",
        detail:
          "The product-specific state listing dates death records to 1867. Check the live application for coverage and ordering channels.",
        extra: [],
      },
      marriage: {
        url: "https://www.michigan.gov/mdhhs/doing-business/vitalrecords/order-a-copy-of-a-vital-record",
        authority: "Michigan Division for Vital Records and Health Statistics",
        record:
          "Michigan offers certified copies and other record services; choose the product requested by the receiving office.",
        access:
          "Michigan lists no photo-ID requirement for these standard certified marriage copies. Confidential probate marriage records have separate restrictions.",
        route:
          "Use the Michigan vital-record ordering service or ask the county clerk about local copies.",
        detail:
          "The product-specific state listing dates marriage records to 1867. Check the live application for coverage and ordering channels.",
        extra: [],
      },
      divorce: {
        url: "https://www.michigan.gov/mdhhs/doing-business/vitalrecords/order-a-copy-of-a-vital-record",
        authority: "Michigan Division for Vital Records and Health Statistics",
        record: "A certified state divorce record is separate from the court’s full judgment.",
        access:
          "Michigan lists no photo-ID requirement for standard certified divorce copies. Follow the selected product’s application requirements.",
        route:
          "Use the Michigan vital-record ordering service; contact the case court if you need the full decree.",
        detail:
          "The product-specific state listing dates divorce records to 1897. Check the live application for coverage and ordering channels.",
        extra: [],
      },
    },
  },
  "new-jersey": {
    name: "New Jersey",
    records: {
      death: {
        url: "https://www.nj.gov/health/vital/order-vital/non-genealogical-records/",
        authority: "New Jersey Office of Vital Statistics and Registry and local registrars",
        record:
          "A certified copy is a legal document. A plain-paper certification is informational and not valid for legal purposes.",
        access:
          "Certified copies require identity and relationship proof; informational certifications still require identity proof.",
        route: "Use the state service or the registrar for the municipality holding the record.",
        detail:
          "Mailing addresses generally must match identification; follow the official alternate-address instructions if needed.",
        extra: [
          ["New Jersey: copy types and ordering", "https://www.nj.gov/health/vital/order-vital/"],
        ],
      },
      marriage: {
        url: "https://www.nj.gov/health/vital/order-vital/non-genealogical-records/",
        authority: "New Jersey Office of Vital Statistics and Registry and local registrars",
        record:
          "A certified copy is a legal document. A plain-paper certification is informational and not valid for legal purposes.",
        access:
          "Certified copies require identity and relationship proof; informational certifications still require identity proof.",
        route: "Use the state service or the registrar for the municipality holding the record.",
        detail:
          "Mailing addresses generally must match identification; follow the official alternate-address instructions if needed.",
        extra: [
          ["New Jersey: copy types and ordering", "https://www.nj.gov/health/vital/order-vital/"],
        ],
      },
      divorce: {
        url: "https://www.nj.gov/health/vital/registration-vital/divorce-decrees/",
        authority: "Superior Court of New Jersey",
        record:
          "The final judgment of divorce is a court record, not an Office of Vital Statistics certificate.",
        access:
          "Follow the Judiciary’s records-request instructions for identification and access; do not assume all case documents are public.",
        route: "Request the certified final judgment through the Superior Court Clerk’s office.",
        detail:
          "The health department directs divorce-decree requests to the Superior Court Records Center.",
        extra: [
          [
            "NJ Courts: certified final judgment",
            "https://www.njcourts.gov/faq/how-do-i-obtain-a-copy-of-a-final-judgment-of-divorce",
          ],
        ],
      },
    },
  },
  virginia: {
    name: "Virginia",
    records: {
      death: {
        url: "https://www.vdh.virginia.gov/vital-records/frequently-asked-questions/",
        authority: "Virginia Office of Vital Records",
        record: "Use the certified record appropriate to the purpose rather than an index entry.",
        access:
          "Virginia restricts recent records to eligible applicants; death, marriage and divorce information becomes public after 25 years.",
        route: "Compare the Office of Vital Records route with the available local service.",
        detail:
          "Virginia lists death records for 1853-1896 and from June 1912 onward; the intervening gap needs separate research.",
        extra: [
          [
            "Virginia: application instructions",
            "https://www.vdh.virginia.gov/vital-records/applications-for-a-vital-record/",
          ],
        ],
      },
      marriage: {
        url: "https://www.vdh.virginia.gov/vital-records/frequently-asked-questions/",
        authority: "Virginia Office of Vital Records and the relevant Circuit Court",
        record: "Use the certified record appropriate to the purpose rather than an index entry.",
        access:
          "Virginia restricts recent records to eligible applicants; death, marriage and divorce information becomes public after 25 years.",
        route: "Compare the Office of Vital Records route with the available local service.",
        detail: "The state FAQ lists marriage records from 1853.",
        extra: [
          [
            "Virginia: application instructions",
            "https://www.vdh.virginia.gov/vital-records/applications-for-a-vital-record/",
          ],
        ],
      },
      divorce: {
        url: "https://www.vdh.virginia.gov/vital-records/frequently-asked-questions/",
        authority: "Virginia Office of Vital Records and the relevant Circuit Court",
        record: "The state divorce certificate and court decree have different contents.",
        access:
          "Virginia restricts recent records to eligible applicants; death, marriage and divorce information becomes public after 25 years.",
        route: "Contact the Circuit Court for the full divorce decree.",
        detail: "Virginia lists divorce holdings from 1918.",
        extra: [
          [
            "Virginia: application instructions",
            "https://www.vdh.virginia.gov/vital-records/applications-for-a-vital-record/",
          ],
        ],
      },
    },
  },
  washington: {
    name: "Washington",
    records: {
      death: {
        url: "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/ordering-vital-record/death-record",
        authority: "Washington Department of Health, Center for Health Statistics",
        record:
          "Choose the long form, short form or noncertified informational death copy for your purpose.",
        access:
          "Certified death copies require a qualifying relationship and the state’s identity and supporting documentation.",
        route: "Follow the Department of Health’s death-record instructions and local options.",
        detail:
          "Different death products contain different information. Ask the receiving organization which copy it needs.",
        extra: [],
      },
      marriage: {
        url: "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/ordering-vital-record/marriage-or-divorce-record",
        authority: "Washington Department of Health; county auditor for local marriage copies",
        record: "A filed marriage record is different from the license issued before a ceremony.",
        access:
          "Anyone may request a state marriage or divorce certificate without identity or relationship proof.",
        route:
          "For a recent marriage, ask the county auditor where the license was issued about a certified county copy.",
        detail:
          "State marriage and divorce certificates cover events from 1968. Recently finalized records may not yet have reached the state.",
        extra: [
          [
            "Washington: correcting marriage/divorce certificates",
            "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/how-correct-record/changing-marriage-and-divorce-certificates",
          ],
        ],
      },
      divorce: {
        url: "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/ordering-vital-record/marriage-or-divorce-record",
        authority: "Washington Department of Health; Superior Court clerk for a decree",
        record: "The one-page divorce certificate does not contain the decree’s full terms.",
        access:
          "Anyone may request a state marriage or divorce certificate without identity or relationship proof.",
        route:
          "For a full divorce decree or a pre-1968 divorce, contact the county Superior Court clerk.",
        detail:
          "State marriage and divorce certificates cover events from 1968. Recently finalized records may not yet have reached the state.",
        extra: [
          [
            "Washington: correcting marriage/divorce certificates",
            "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/how-correct-record/changing-marriage-and-divorce-certificates",
          ],
        ],
      },
    },
  },
} as const;
