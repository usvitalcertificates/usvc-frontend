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

  arizona: {
    name: "Arizona",
    records: {
      birth: {
        url: "https://www.azdhs.gov/director/vital-records/",
        authority: "Arizona Department of Health Services, Bureau of Vital Records",
        record:
          "Request an agency-certified birth record; a hospital souvenir or online index is not a certified copy.",
        access:
          "Arizona restricts access to recent birth records. Check the eligible-applicant categories and required identity and relationship evidence.",
        route:
          "Begin with Arizona Department of Health Services, Bureau of Vital Records and its official birth-record application.",
        detail:
          "The state holds records from July 1909 and abstracts of earlier county filings; some county offices also issue certified copies.",
        extra: [
          ["CDC: Arizona record offices", "https://www.cdc.gov/nchs/w2w/arizona.htm"],
          [
            "Arizona State Library: personal record access",
            "https://azlibrary.gov/records/public-records",
          ],
        ],
      },
      death: {
        url: "https://www.azdhs.gov/director/vital-records/",
        authority: "Arizona Department of Health Services, Bureau of Vital Records",
        record:
          "Request a certified death record and confirm which version the receiving institution needs.",
        access:
          "Arizona restricts access to recent death records. Follow the official eligibility and identification instructions for your relationship or interest.",
        route:
          "Follow the official death-record instructions from Arizona Department of Health Services, Bureau of Vital Records.",
        detail:
          "The state holds death records from July 1909 and abstracts of earlier county filings. Check the county options listed by the state.",
        extra: [
          ["CDC: Arizona record offices", "https://www.cdc.gov/nchs/w2w/arizona.htm"],
          [
            "Arizona State Library: personal record access",
            "https://azlibrary.gov/records/public-records",
          ],
        ],
      },
      marriage: {
        url: "https://www.cdc.gov/nchs/w2w/arizona.htm",
        authority: "County Clerk of Superior Court",
        record:
          "Obtain a certified copy of the recorded marriage from the county holding the license.",
        access: "Ask the county clerk about access, identification and certification requirements.",
        route:
          "Contact the Clerk of Superior Court in the county where the marriage license was issued.",
        detail:
          "Marriage copies follow the county process, rather than the state birth/death application.",
        extra: [],
      },
      divorce: {
        url: "https://www.cdc.gov/nchs/w2w/arizona.htm",
        authority: "County Clerk of Superior Court",
        record: "Request the decree or final judgment when you need the court’s divorce terms.",
        access: "Court-file access and certified-copy requirements must be checked with the clerk.",
        route: "Contact the Clerk of Superior Court in the county where the divorce was granted.",
        detail:
          "Identify the court county and case number if known before requesting a certified decree.",
        extra: [],
      },
    },
  },
  tennessee: {
    name: "Tennessee",
    records: {
      birth: {
        url: "https://www.tn.gov/health/vr",
        authority: "Tennessee Department of Health, Office of Vital Records",
        record:
          "Request an agency-certified birth record; a hospital souvenir or online index is not a certified copy.",
        access:
          "Use Tennessee’s identification requirements and application to establish your eligibility and any authorization needed.",
        route:
          "Begin with Tennessee Department of Health, Office of Vital Records and its official birth-record application.",
        detail:
          "Vital Records keeps birth records for 100 years; older records are routed to the Tennessee State Library and Archives.",
        extra: [
          [
            "Tennessee: identification requirements",
            "https://vitalrecords.tn.gov/hc/en-us/articles/36331554733587-Identification-Requirements",
          ],
          ["CDC: Tennessee record offices", "https://www.cdc.gov/nchs/w2w/tennessee.htm"],
        ],
      },
      death: {
        url: "https://www.tn.gov/health/vr",
        authority: "Tennessee Department of Health, Office of Vital Records",
        record:
          "Request a certified death record and confirm which version the receiving institution needs.",
        access:
          "Follow Tennessee’s application and identification requirements; check eligibility before requesting another person’s record.",
        route:
          "Follow the official death-record instructions from Tennessee Department of Health, Office of Vital Records.",
        detail:
          "Vital Records keeps death records for 50 years; older records are routed to the Tennessee State Library and Archives.",
        extra: [
          [
            "Tennessee: identification requirements",
            "https://vitalrecords.tn.gov/hc/en-us/articles/36331554733587-Identification-Requirements",
          ],
          ["CDC: Tennessee record offices", "https://www.cdc.gov/nchs/w2w/tennessee.htm"],
        ],
      },
      marriage: {
        url: "https://www.tn.gov/health/vr",
        authority: "Tennessee Office of Vital Records; county clerk for local records",
        record:
          "A state marriage certificate records the event; confirm whether a county-certified license copy is required.",
        access: "Follow the state’s identification and eligible-applicant requirements.",
        route:
          "Start with Tennessee Vital Records for its marriage certificate or ask the issuing county clerk for a local copy.",
        detail:
          "The state office keeps marriage records for 50 years; consult the State Library and Archives for older holdings.",
        extra: [
          [
            "Tennessee: identification requirements",
            "https://vitalrecords.tn.gov/hc/en-us/articles/36331554733587-Identification-Requirements",
          ],
          ["CDC: Tennessee record offices", "https://www.cdc.gov/nchs/w2w/tennessee.htm"],
        ],
      },
      divorce: {
        url: "https://www.tn.gov/health/vr",
        authority: "Tennessee Office of Vital Records; court clerk for a decree",
        record: "A divorce certificate is separate from the court’s full decree.",
        access:
          "Follow the state’s identification and eligible-applicant requirements; court-file access is a separate matter.",
        route:
          "Use Tennessee Vital Records for its divorce certificate and the court that granted the divorce for the decree.",
        detail:
          "The state office keeps divorce records for 50 years; older holdings are routed to the State Library and Archives.",
        extra: [
          [
            "Tennessee: identification requirements",
            "https://vitalrecords.tn.gov/hc/en-us/articles/36331554733587-Identification-Requirements",
          ],
          ["CDC: Tennessee record offices", "https://www.cdc.gov/nchs/w2w/tennessee.htm"],
        ],
      },
    },
  },
  massachusetts: {
    name: "Massachusetts",
    records: {
      birth: {
        url: "https://www.mass.gov/how-to/order-a-birth-marriage-or-death-certificate",
        authority: "Massachusetts Registry of Vital Records and Statistics",
        record:
          "Request an agency-certified birth record; a hospital souvenir or online index is not a certified copy.",
        access:
          "Provide identification. Some records require evidence of relationship or authority, so check the Registry’s instructions for your record.",
        route:
          "Begin with Massachusetts Registry of Vital Records and Statistics and its official birth-record application.",
        detail:
          "Records from 1931 through 1935 have transferred to the State Archives. Earlier birth records may also be available from the city or town where the event occurred.",
        extra: [
          [
            "Massachusetts: historical vital records",
            "https://www.sec.state.ma.us/divisions/archives/collections/vital-records.htm",
          ],
        ],
      },
      death: {
        url: "https://www.mass.gov/how-to/order-a-birth-marriage-or-death-certificate",
        authority: "Massachusetts Registry of Vital Records and Statistics",
        record:
          "Request a certified death record and confirm which version the receiving institution needs.",
        access:
          "Provide identification and any relationship or authorization documents required by the Registry’s application.",
        route:
          "Follow the official death-record instructions from Massachusetts Registry of Vital Records and Statistics.",
        detail:
          "Records from 1931 through 1935 have transferred to the State Archives. Earlier death records may also be available from the city or town where the event occurred.",
        extra: [
          [
            "Massachusetts: historical vital records",
            "https://www.sec.state.ma.us/divisions/archives/collections/vital-records.htm",
          ],
        ],
      },
      marriage: {
        url: "https://www.mass.gov/how-to/order-a-birth-marriage-or-death-certificate",
        authority: "Massachusetts Registry of Vital Records and Statistics; city or town clerk",
        record:
          "Request a certified record of the completed marriage, rather than an unused license.",
        access:
          "Provide identification and check whether the record requires additional relationship or authorization evidence.",
        route:
          "Use the Registry’s ordering instructions or ask the city or town holding the marriage record.",
        detail:
          "The 1931 through 1935 records have transferred to the State Archives. Earlier marriage records may also be available where the marriage intentions were filed.",
        extra: [
          [
            "Massachusetts: historical vital records",
            "https://www.sec.state.ma.us/divisions/archives/collections/vital-records.htm",
          ],
        ],
      },
      divorce: {
        url: "https://www.mass.gov/how-to/get-a-copy-of-your-divorce-record",
        authority: "Massachusetts Probate and Family Court",
        record:
          "Choose a Certificate of Divorce Absolute or a certified judgment according to the receiving organization’s requirements.",
        access:
          "Check the court’s copy-request requirements and any restrictions on the requested case documents.",
        route: "Request the document from the Probate and Family Court that handled the divorce.",
        detail:
          "The Registry can help locate the docket number and court; it does not replace the court’s certified divorce document.",
        extra: [
          [
            "Massachusetts: find divorce information",
            "https://www.mass.gov/how-to/request-divorce-information",
          ],
        ],
      },
    },
  },
  indiana: {
    name: "Indiana",
    records: {
      birth: {
        url: "https://www.in.gov/health/vital-records/",
        authority: "Indiana Department of Health, Vital Records",
        record:
          "Request an agency-certified birth record; a hospital souvenir or online index is not a certified copy.",
        access:
          "Provide acceptable identification and any evidence of relationship or legal interest required by Indiana’s application.",
        route:
          "Begin with Indiana Department of Health, Vital Records and its official birth-record application.",
        detail:
          "State birth records begin in October 1907. Ask the city or county health department about earlier holdings.",
        extra: [["CDC: Indiana record offices", "https://www.cdc.gov/nchs/w2w/indiana.htm"]],
      },
      death: {
        url: "https://www.in.gov/health/vital-records/",
        authority: "Indiana Department of Health, Vital Records",
        record:
          "Request a certified death record and confirm which version the receiving institution needs.",
        access:
          "Provide acceptable identification and any proof of relationship or legal interest required for the death record.",
        route:
          "Follow the official death-record instructions from Indiana Department of Health, Vital Records.",
        detail:
          "State death records begin in January 1900. Ask the city or county health department about earlier holdings.",
        extra: [["CDC: Indiana record offices", "https://www.cdc.gov/nchs/w2w/indiana.htm"]],
      },
      marriage: {
        url: "https://www.in.gov/health/vital-records/marriages",
        authority: "County Clerk of Circuit Court or Superior Court",
        record:
          "A county-certified marriage certificate is different from the state’s Record of Marriage.",
        access: "Ask the county clerk about its identification, access and certification process.",
        route:
          "Request a certified marriage certificate from the clerk in the county where the license was issued.",
        detail:
          "Indiana maintains a marriage index from 1958; do not substitute the state record for a county certificate without checking acceptance.",
        extra: [["CDC: Indiana record offices", "https://www.cdc.gov/nchs/w2w/indiana.htm"]],
      },
      divorce: {
        url: "https://www.cdc.gov/nchs/w2w/indiana.htm",
        authority: "County court clerk",
        record: "Request a certified divorce decree from the court holding the case.",
        access: "Court records and certified copies follow the clerk’s access rules.",
        route: "Contact the county clerk where the divorce was granted.",
        detail:
          "The state birth/death certificate service does not issue the county court’s divorce decree.",
        extra: [],
      },
    },
  },
  missouri: {
    name: "Missouri",
    records: {
      birth: {
        url: "https://health.mo.gov/vital-records-registries/vital-records/order-copy-vital-record",
        authority: "Missouri Department of Health and Senior Services, Bureau of Vital Records",
        record:
          "Request an agency-certified birth record; a hospital souvenir or online index is not a certified copy.",
        access:
          "Applicants must have a direct and tangible interest. Check identity, signature and mail-in notarization requirements.",
        route:
          "Begin with Missouri Department of Health and Senior Services, Bureau of Vital Records and its official birth-record application.",
        detail:
          "The central registry began January 1, 1910. State and local offices offer different coverage and short-form or long-form options.",
        extra: [
          [
            "Missouri: vital record questions",
            "https://health.mo.gov/vital-records-registries/vital-records/frequently-asked-questions",
          ],
        ],
      },
      death: {
        url: "https://health.mo.gov/vital-records-registries/vital-records/order-copy-vital-record",
        authority: "Missouri Department of Health and Senior Services, Bureau of Vital Records",
        record:
          "Request a certified death record and confirm which version the receiving institution needs.",
        access:
          "Applicants must have a direct and tangible interest. Follow the identity and notarization rules for the chosen request channel.",
        route:
          "Follow the official death-record instructions from Missouri Department of Health and Senior Services, Bureau of Vital Records.",
        detail:
          "The central registry began January 1, 1910. Local short-form death records cover 1980 onward; state records have broader coverage.",
        extra: [
          [
            "Missouri: vital record questions",
            "https://health.mo.gov/vital-records-registries/vital-records/frequently-asked-questions",
          ],
        ],
      },
      marriage: {
        url: "https://health.mo.gov/vital-records-registries/vital-records/order-copy-vital-record",
        authority: "County Recorder of Deeds; Missouri Bureau of Vital Records for a statement",
        record:
          "A Certified Statement Relating to Marriage is not the original marriage certificate.",
        access:
          "State statements require a qualifying direct and tangible interest; check the county’s rules for its certified copy.",
        route:
          "Request the marriage certificate from the Recorder of Deeds in the county where the license was obtained.",
        detail:
          "The state’s marriage statements summarize reported events from July 1, 1948; the county holds the actual certificate.",
        extra: [
          [
            "Missouri: vital record questions",
            "https://health.mo.gov/vital-records-registries/vital-records/frequently-asked-questions",
          ],
        ],
      },
      divorce: {
        url: "https://health.mo.gov/vital-records-registries/vital-records/order-copy-vital-record",
        authority: "County Circuit Clerk; Missouri Bureau of Vital Records for a statement",
        record: "A Certified Statement Relating to Divorce is not the divorce decree.",
        access:
          "State statements require a qualifying direct and tangible interest; court copies follow the clerk’s rules.",
        route:
          "Request the decree from the Circuit Clerk in the county where the divorce was granted.",
        detail:
          "Use the state statement only if its summary is accepted; request the court’s decree when the full judgment is required.",
        extra: [
          [
            "Missouri: vital record questions",
            "https://health.mo.gov/vital-records-registries/vital-records/frequently-asked-questions",
          ],
        ],
      },
    },
  },
  maryland: {
    name: "Maryland",
    records: {
      birth: {
        url: "https://health.maryland.gov/vsa/Pages/birth.aspx",
        authority: "Maryland Department of Health, Division of Vital Records",
        record:
          "Request an agency-certified birth record; a hospital souvenir or online index is not a certified copy.",
        access:
          "The subject, a named parent and other specifically authorized applicants may apply. Guardians and representatives must supply the required evidence.",
        route:
          "Begin with Maryland Department of Health, Division of Vital Records and its official birth-record application.",
        detail:
          "Check state and participating local-health-department options. Delayed registration and amendments use separate procedures.",
        extra: [],
      },
      death: {
        url: "https://health.maryland.gov/vsa/Pages/death.aspx",
        authority: "Maryland Department of Health, Division of Vital Records",
        record:
          "Request a certified death record and confirm which version the receiving institution needs.",
        access:
          "Check the death-record application for qualifying relationship, authorization and identity evidence.",
        route:
          "Follow the official death-record instructions from Maryland Department of Health, Division of Vital Records.",
        detail:
          "Use the Division’s death-record page to confirm coverage and the office holding an older record.",
        extra: [],
      },
      marriage: {
        url: "https://health.maryland.gov/vsa/Pages/marriage.aspx",
        authority: "Maryland Division of Vital Records; Circuit Court clerk for local copies",
        record: "Obtain a certified marriage record from the appropriate state or court custodian.",
        access:
          "Check the marriage application for eligible applicants and required identity or authorization evidence.",
        route:
          "Start with the Division’s marriage-record instructions or contact the Circuit Court clerk where the license was issued.",
        detail:
          "The state marriage certificate service covers marriages from January 1, 2007; ask the court clerk about earlier records.",
        extra: [],
      },
      divorce: {
        url: "https://health.maryland.gov/vsa/Pages/divorce.aspx",
        authority: "Maryland Division of Vital Records; Circuit Court for a decree",
        record: "A Verification of Divorce summarizes the event and is not the actual decree.",
        access:
          "Either spouse, an authorized representative or an attorney representing a spouse may apply under the Division’s stated requirements.",
        route:
          "Use the Division for a verification and the Circuit Court that granted the divorce for the actual decree.",
        detail:
          "Confirm the event date with the Division before ordering an older verification; the court holds the decree.",
        extra: [],
      },
    },
  },
  colorado: {
    name: "Colorado",
    records: {
      birth: {
        url: "https://www.cdc.gov/nchs/w2w/colorado.htm",
        authority: "Colorado Department of Public Health and Environment, Vital Records",
        record:
          "Request an agency-certified birth record; a hospital souvenir or online index is not a certified copy.",
        access:
          "Provide identification and check the state’s current eligible-applicant and supporting-document requirements.",
        route:
          "Begin with Colorado Department of Public Health and Environment, Vital Records and its official birth-record application.",
        detail:
          "State birth holdings begin in 1910, with some earlier county records. Check the issuing office for the specific event.",
        extra: [],
      },
      death: {
        url: "https://www.cdc.gov/nchs/w2w/colorado.htm",
        authority: "Colorado Department of Public Health and Environment, Vital Records",
        record:
          "Request a certified death record and confirm which version the receiving institution needs.",
        access:
          "Provide identification and check eligibility and any supporting evidence required by the issuing office.",
        route:
          "Follow the official death-record instructions from Colorado Department of Public Health and Environment, Vital Records.",
        detail:
          "State death holdings begin in 1900. Confirm the record and copy type with the issuing office.",
        extra: [],
      },
      marriage: {
        url: "https://www.cdc.gov/nchs/w2w/colorado.htm",
        authority: "County Clerk and Recorder; Colorado Vital Records for index verification",
        record: "The state index verification is separate from a county-certified marriage copy.",
        access:
          "Check eligibility for the state verification and the county’s requirements for a certified marriage copy.",
        route:
          "Request the certified marriage copy from the county clerk where the license was issued.",
        detail:
          "Colorado’s state health department offers index verification rather than the certified county marriage document.",
        extra: [],
      },
      divorce: {
        url: "https://www.cdc.gov/nchs/w2w/colorado.htm",
        authority: "Clerk of District Court; Colorado Vital Records for index verification",
        record: "The state index verification does not replace the certified divorce decree.",
        access:
          "Court-file access and certified-copy requirements must be checked with the district court clerk.",
        route:
          "Request the decree from the Clerk of District Court in the county where the divorce was granted.",
        detail:
          "Colorado’s state health department offers index verification; the court holds the certified divorce document.",
        extra: [],
      },
    },
  },
  nevada: {
    name: "Nevada",
    records: {
      birth: {
        url: "https://www.dpbh.nv.gov/Programs/VitalRecords/",
        authority: "Nevada Division of Public and Behavioral Health, Office of Vital Records",
        record:
          "Request a certified copy of the birth certificate from the state or the local health district for the county of birth.",
        access:
          "Check that you have a direct and tangible interest, such as being the registrant or a direct family member, and review the state’s proof of relationship and identification lists.",
        route:
          "Apply to the Office of Vital Records in Carson City, or for Clark County births to the Southern Nevada Health District.",
        detail:
          "The state holds birth records filed from July 1, 1911; earlier records are usually with the county recorder where the birth occurred.",
        sourceChecked: "11/27/2026",
        extra: [["CDC: Nevada record offices", "https://www.cdc.gov/nchs/w2w/nevada.htm"]],
      },
      death: {
        url: "https://www.dpbh.nv.gov/Programs/VitalRecords/",
        authority: "Nevada Division of Public and Behavioral Health, Office of Vital Records",
        record:
          "Request a certified copy of the death certificate from the state or the local health district for the county of death.",
        access:
          "Check that you have a direct and tangible interest, such as being a direct family member or legal representative, and review the state’s proof of relationship and identification lists.",
        route:
          "Apply to the Office of Vital Records in Carson City, or for Clark County deaths to the Southern Nevada Health District.",
        detail:
          "The state holds death records filed from July 1, 1911; earlier records are usually with the county recorder where the death occurred.",
        sourceChecked: "11/27/2026",
        extra: [["CDC: Nevada record offices", "https://www.cdc.gov/nchs/w2w/nevada.htm"]],
      },
      marriage: {
        url: "https://www.cdc.gov/nchs/w2w/nevada.htm",
        authority: "County office in the county where the marriage license was issued",
        record:
          "Obtain a certified copy of the recorded marriage certificate from the county that issued the license.",
        access:
          "Ask the county office about access, identification and certification requirements.",
        route:
          "Contact the county where the license was purchased; in Clark County, that is the County Clerk.",
        detail:
          "The state Office of Vital Records only searches and verifies marriage events and does not issue certified marriage copies.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Clark County Clerk: proof of marriage",
            "https://www.clarkcountynv.gov/government/elected_officials/county_clerk/what-is-proof-of-marriage",
          ],
        ],
      },
      divorce: {
        url: "https://www.cdc.gov/nchs/w2w/nevada.htm",
        authority: "District court clerk in the county where the divorce was granted",
        record:
          "Request a certified copy of the divorce decree from the court that granted the divorce.",
        access: "Ask the court clerk about access, identification and certification requirements.",
        route:
          "Contact the court clerk in the county where the divorce was granted; in Clark County, that is the Eighth Judicial District Court (Family Court).",
        detail:
          "Nevada’s state office does not issue divorce certificates; it only searches and verifies divorce events.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Clark County Recorder: divorce records",
            "https://www.clarkcountynv.gov/government/elected_officials/county_recorder/divorce-records",
          ],
        ],
      },
    },
  },
  oklahoma: {
    name: "Oklahoma",
    records: {
      birth: {
        url: "https://oklahoma.gov/health/services/birth-and-death-certificates/birth-certificates.html",
        authority: "Oklahoma State Department of Health, Vital Records Service",
        record:
          "Request a certified copy of the birth certificate from the state Vital Records Service.",
        access:
          "Check eligibility first: the person named on the record, or a parent if that person is a minor, may order directly, while others need signed authorization or proof of legal relationship.",
        route: "Order from OSDH Vital Records using its listed online, phone or mail options.",
        detail:
          "Oklahoma began filing birth records in October 1908, though filing was not mandatory until 1917.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "OSDH: acceptable identification",
            "https://oklahoma.gov/health/services/birth-and-death-certificates/acceptable-identification.html",
          ],
          [
            "OSDH: Vital Records forms",
            "https://oklahoma.gov/health/services/birth-and-death-certificates/vital-records-forms.html",
          ],
        ],
      },
      death: {
        url: "https://oklahoma.gov/health/services/birth-and-death-certificates/death-certificates.html",
        authority: "Oklahoma State Department of Health, Vital Records Service",
        record:
          "Request a certified copy of the death certificate from the state Vital Records Service.",
        access:
          "Check that you qualify, for example as a close family member, legal guardian, estate representative with a court order or funeral director, and have acceptable ID ready.",
        route: "Order from OSDH Vital Records using its listed online, phone or mail options.",
        detail: "The state office holds death records filed from October 1908 onward.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "OSDH: Vital Records FAQs",
            "https://oklahoma.gov/health/services/birth-and-death-certificates/faqs.html",
          ],
          ["CDC: Oklahoma record offices", "https://www.cdc.gov/nchs/w2w/oklahoma.htm"],
        ],
      },
      marriage: {
        url: "https://www.cdc.gov/nchs/w2w/oklahoma.htm",
        authority: "Court Clerk of the county where the license was issued",
        record:
          "Obtain a certified copy of the recorded marriage license from the county court clerk that issued it.",
        access:
          "Ask the county court clerk about access, identification and certification requirements.",
        route:
          "Contact the Court Clerk in the county where the marriage license was issued, not the state Vital Records office.",
        detail:
          "OSDH Vital Records holds only birth and death records and refers marriage requests to the county court clerk.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "OSDH: Vital Records main page",
            "https://oklahoma.gov/health/services/birth-and-death-certificates.html",
          ],
        ],
      },
      divorce: {
        url: "https://www.cdc.gov/nchs/w2w/oklahoma.htm",
        authority: "Court Clerk of the county where the divorce was granted",
        record:
          "Request a certified copy of the divorce decree from the court clerk that holds the case file.",
        access:
          "Ask the court clerk about access, identification and certification requirements for the case file.",
        route: "Contact the Court Clerk in the county where the divorce was granted.",
        detail:
          "Oklahoma has no state divorce certificate; the decree stays with the county court that granted it.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "OSDH: Vital Records main page",
            "https://oklahoma.gov/health/services/birth-and-death-certificates.html",
          ],
        ],
      },
    },
  },
  delaware: {
    name: "Delaware",
    records: {
      birth: {
        url: "https://delaware.gov/guides/certificates/",
        authority: "Delaware Division of Public Health, Office of Vital Statistics",
        record:
          "Request a certified birth certificate from the Office of Vital Statistics; older public birth records are copied by the Delaware Public Archives.",
        access:
          "Check that you are the registrant, a qualifying family member, guardian or authorized representative, or can show a legal need, and have photo ID ready.",
        route:
          "Send recent birth requests to the state Office of Vital Statistics; Delaware does not use county birth offices.",
        detail:
          "Birth records become public after 72 years, and those older records are requested from the Delaware Public Archives.",
        sourceChecked: "11/27/2026",
        extra: [
          ["CDC: Delaware record offices", "https://www.cdc.gov/nchs/w2w/delaware.htm"],
          [
            "Delaware Public Archives: vital statistics records",
            "https://archives.delaware.gov/digital-archives/guide-to-vital-statistics-records/",
          ],
        ],
      },
      death: {
        url: "https://delaware.gov/guides/certificates/",
        authority: "Delaware Division of Public Health, Office of Vital Statistics",
        record:
          "Request a certified death certificate from the Office of Vital Statistics; older public death records are copied by the Delaware Public Archives.",
        access:
          "Check that you are a qualifying family member, guardian or authorized representative, or can show the record is needed to protect personal or property rights.",
        route:
          "Send recent death requests to the state Office of Vital Statistics rather than a county office.",
        detail:
          "Death records become public after 40 years, and those older records are requested from the Delaware Public Archives.",
        sourceChecked: "11/27/2026",
        extra: [
          ["CDC: Delaware record offices", "https://www.cdc.gov/nchs/w2w/delaware.htm"],
          [
            "Delaware Public Archives: vital statistics records",
            "https://archives.delaware.gov/digital-archives/guide-to-vital-statistics-records/",
          ],
        ],
      },
      marriage: {
        url: "https://delaware.gov/guides/certificates/",
        authority: "Delaware Division of Public Health, Office of Vital Statistics",
        record:
          "Request a certified marriage certificate from the Office of Vital Statistics, which receives a record of marriages performed in Delaware.",
        access:
          "Check the Office of Vital Statistics eligibility and photo ID requirements before applying.",
        route: "Send marriage requests to the state Office of Vital Statistics.",
        detail:
          "Marriage records become public after 50 years, and those older records are requested from the Delaware Public Archives.",
        sourceChecked: "11/27/2026",
        extra: [
          ["CDC: Delaware record offices", "https://www.cdc.gov/nchs/w2w/delaware.htm"],
          ["Delaware Public Archives: FAQs", "https://archives.delaware.gov/faqs/"],
        ],
      },
      divorce: {
        url: "https://courts.delaware.gov/family/divorce/decree_copies.aspx",
        authority:
          "Delaware Family Court Records Department in the county that granted the divorce",
        record:
          "Request a certified copy of the divorce decree from Family Court; the state vital records office does not issue divorce copies.",
        access:
          "Check the court’s identification rules: photo ID for in-person requests or a notarized signature on mailed requests.",
        route:
          "Contact the Family Court Records Department in New Castle, Kent or Sussex County, whichever granted the divorce.",
        detail:
          "Older divorces may be held by the Superior Court Prothonotary or the Delaware Public Archives, depending on county and year.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Delaware.gov: certificates by type and year",
            "https://delaware.gov/guides/certificates/",
          ],
          [
            "Delaware Family Court: records access",
            "https://www.courts.delaware.gov/family/fcrecordaccess.aspx",
          ],
        ],
      },
    },
  },
  nebraska: {
    name: "Nebraska",
    records: {
      birth: {
        url: "https://dhhs.ne.gov/Pages/vital-records.aspx",
        authority: "Nebraska Department of Health and Human Services, Office of Vital Records",
        record:
          "Request a certified copy of the birth certificate from the state vital records office.",
        access:
          "Check the state’s current eligibility and identification requirements before you apply.",
        route:
          "Send the request to Nebraska Vital Records in Lincoln, which handles birth records statewide.",
        detail: "The state office holds Nebraska birth records from late 1904 onward.",
        sourceChecked: "11/27/2026",
        extra: [["CDC: Nebraska record offices", "https://www.cdc.gov/nchs/w2w/nebraska.htm"]],
      },
      death: {
        url: "https://dhhs.ne.gov/Pages/vital-records.aspx",
        authority: "Nebraska Department of Health and Human Services, Office of Vital Records",
        record:
          "Request a certified copy of the death certificate from the state vital records office.",
        access:
          "Check the state’s current eligibility, relationship and identification requirements before you apply.",
        route:
          "Send the request to Nebraska Vital Records in Lincoln, which handles death records statewide.",
        detail: "The state office holds Nebraska death records from late 1904 onward.",
        sourceChecked: "11/27/2026",
        extra: [["CDC: Nebraska record offices", "https://www.cdc.gov/nchs/w2w/nebraska.htm"]],
      },
      marriage: {
        url: "https://www.cdc.gov/nchs/w2w/nebraska.htm",
        authority: "Nebraska Office of Vital Records or the county that issued the license",
        record:
          "Request a certified copy of the recorded marriage from the state office or the issuing county.",
        access:
          "Check the eligibility and ID rules of the office you apply to before sending a request.",
        route:
          "Contact the county that issued the license, or Nebraska Vital Records in Lincoln for a statewide record.",
        detail:
          "The state office holds marriage records from January 1909, while a county can copy only licenses it issued.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Saunders County Clerk: marriage licenses (county example)",
            "https://saunderscounty.ne.gov/county-clerk/marriage-licenses/",
          ],
        ],
      },
      divorce: {
        url: "https://nebraskajudicial.gov/self-help/families-children/simple-divorce-no-children",
        authority: "Clerk of the District Court in the county where the divorce was granted",
        record:
          "Request a certified copy of the decree from the district court when you need the court’s divorce terms.",
        access:
          "Ask the clerk of the district court about access, identification and certification requirements.",
        route:
          "Contact the Clerk of the District Court in the county where the divorce was granted.",
        detail:
          "The state vital records office also keeps divorce records from January 1909, but the full decree stays with the district court.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Nebraska Judicial Branch: district court clerks",
            "https://nebraskajudicial.gov/courts/district-court/clerks-contact-information",
          ],
          ["CDC: Nebraska record offices", "https://www.cdc.gov/nchs/w2w/nebraska.htm"],
        ],
      },
    },
  },
  idaho: {
    name: "Idaho",
    records: {
      birth: {
        url: "https://healthandwelfare.idaho.gov/services-programs/birth-marriage-death-records/ordering-birth-certificate",
        authority:
          "Idaho Bureau of Vital Records and Health Statistics, Department of Health and Welfare",
        record: "Request a certified copy of the birth certificate filed with the state.",
        access:
          "Check that you have a direct and tangible interest in the record and include a copy of acceptable photo ID showing your signature and expiration date.",
        route:
          "Send the request to the state vital records bureau online or by mail; it does not take birth orders in person.",
        detail: "The state holds birth certificates filed from July 1911 to the present.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Idaho DHW: about birth records",
            "https://healthandwelfare.idaho.gov/services-programs/birth-marriage-death-records/about-birth-records",
          ],
          ["CDC: Idaho record offices", "https://www.cdc.gov/nchs/w2w/idaho.htm"],
        ],
      },
      death: {
        url: "https://healthandwelfare.idaho.gov/services-programs/birth-marriage-death-records/ordering-death-stillbirth-and-miscarriage",
        authority:
          "Idaho Bureau of Vital Records and Health Statistics, Department of Health and Welfare",
        record: "Request a certified copy of the death certificate filed with the state.",
        access:
          "Check that you are immediate family or a legal representative and include a copy of acceptable photo ID.",
        route: "Send the request to the state vital records bureau online or by mail.",
        detail:
          "The state holds death certificates filed since July 1911, and they stay confidential for 50 years.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Idaho DHW: about death records",
            "https://healthandwelfare.idaho.gov/services-programs/birth-marriage-death-records/about-death-stillbirth-and-miscarriage-records",
          ],
        ],
      },
      marriage: {
        url: "https://healthandwelfare.idaho.gov/services-programs/birth-marriage-death-records/ordering-marriage-and-divorce-certficiate",
        authority:
          "Idaho Bureau of Vital Records and Health Statistics, Department of Health and Welfare",
        record: "Request a certified copy of the marriage certificate filed after the ceremony.",
        access:
          "Check that you are immediate family or a legal representative and include a copy of acceptable photo ID.",
        route:
          "Order from the state vital records bureau, or ask the County Recorder where the license was issued about older records.",
        detail: "The state issues marriage certificates filed from May 1947 to the present.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Idaho DHW: about marriage and divorce records",
            "https://healthandwelfare.idaho.gov/services-programs/birth-marriage-death-records/about-marriage-and-divorce-records",
          ],
          ["CDC: Idaho record offices", "https://www.cdc.gov/nchs/w2w/idaho.htm"],
        ],
      },
      divorce: {
        url: "https://healthandwelfare.idaho.gov/services-programs/birth-marriage-death-records/about-marriage-and-divorce-records",
        authority:
          "Idaho Bureau of Vital Records and Health Statistics for certificates; the county where the divorce was granted for the decree",
        record:
          "Decide whether you need the state divorce certificate or the full court decree; the certificate only shows that a divorce occurred.",
        access:
          "Check that you are immediate family or a legal representative and include a copy of acceptable photo ID.",
        route:
          "Order the certificate from the state bureau, and contact the county where the divorce was granted for the decree.",
        detail: "The state issues divorce certificates filed from May 1947 to the present.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Idaho DHW: ordering a marriage or divorce certificate",
            "https://healthandwelfare.idaho.gov/services-programs/birth-marriage-death-records/ordering-marriage-and-divorce-certficiate",
          ],
        ],
      },
    },
  },
  oregon: {
    name: "Oregon",
    records: {
      birth: {
        url: "https://www.oregon.gov/oha/PH/BIRTHDEATHCERTIFICATES/Pages/OrderBirthCertificate.aspx",
        authority: "Oregon Health Authority, Center for Health Statistics (Oregon Vital Records)",
        record:
          "Choose a short form computer-issued copy or a full image long form copy, which the state advises for apostille or use abroad.",
        access:
          "Check that you are an eligible relative or representative and have the required ID; birth records are restricted for 100 years.",
        route:
          "Order from Oregon Vital Records, or from the county vital records office if the birth was within the last six months.",
        detail:
          "Oregon Vital Records holds birth records from 1903, while older public records sit with the Oregon State Archives.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Oregon Vital Records: eligibility",
            "https://www.oregon.gov/oha/PH/BIRTHDEATHCERTIFICATES/Pages/Eligibility.aspx",
          ],
          [
            "Oregon State Archives: vital records",
            "https://sos.oregon.gov/archives/records/pages/aids-vitalrecords.aspx",
          ],
        ],
      },
      death: {
        url: "https://www.oregon.gov/oha/PH/BIRTHDEATHCERTIFICATES/Pages/OrderDeathCertificate.aspx",
        authority: "Oregon Health Authority, Center for Health Statistics (Oregon Vital Records)",
        record:
          "Choose a short form without cause of death or a long form with cause of death, depending on who will receive it.",
        access:
          "Check that you are an eligible relative, representative, funeral contact or property right holder and have acceptable unexpired ID.",
        route:
          "Order from Oregon Vital Records, or from the county vital records office if the death was within the last six months.",
        detail:
          "Long form copies cover deaths from 1903, and short form copies cover deaths from 1978.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Oregon Vital Records: eligibility",
            "https://www.oregon.gov/oha/PH/BIRTHDEATHCERTIFICATES/Pages/Eligibility.aspx",
          ],
        ],
      },
      marriage: {
        url: "https://www.oregon.gov/oha/PH/BIRTHDEATHCERTIFICATES/Pages/OrderMarriageCertificate.aspx",
        authority:
          "Oregon Vital Records for certified certificates; County Clerk for county marriage records",
        record:
          "Request the state certified marriage certificate; a county commemorative certificate is not a legal document.",
        access:
          "Check that you are a named party, eligible relative or authorized representative and have acceptable unexpired ID.",
        route:
          "Order the official certificate from Oregon Vital Records, or contact the County Clerk where the license was issued for the county record.",
        detail:
          "Oregon restricts marriage records for 50 years; older public records are held by the Oregon State Archives.",
        sourceChecked: "11/27/2026",
        extra: [["CDC: Oregon record offices", "https://www.cdc.gov/nchs/w2w/oregon.htm"]],
      },
      divorce: {
        url: "https://www.oregon.gov/oha/PH/BIRTHDEATHCERTIFICATES/Pages/OrderDivorceDissolutionofDomesticPartnership.aspx",
        authority: "Oregon Vital Records for certificates; the county circuit court for decrees",
        record:
          "Decide whether you need the state dissolution certificate as proof of divorce or the full decree from the court.",
        access:
          "Check that you are a named party, eligible relative or authorized representative and have acceptable unexpired ID.",
        route:
          "Order the certificate from Oregon Vital Records, and request the decree from the circuit court in the county that granted the divorce.",
        detail: "Oregon Vital Records holds divorce records from 1925.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "Oregon Judicial Department: find a court record",
            "https://www.courts.oregon.gov/how/Pages/find.aspx",
          ],
          ["CDC: Oregon record offices", "https://www.cdc.gov/nchs/w2w/oregon.htm"],
        ],
      },
    },
  },
  "west-virginia": {
    name: "West Virginia",
    records: {
      birth: {
        url: "https://dhhr.wv.gov/HSC/VR/CR/Pages/default.aspx",
        authority: "West Virginia Vital Registration Office, Health Statistics Center",
        record:
          "Request a certified copy of the birth certificate from the state Vital Registration Office.",
        access:
          "Check the office’s current eligibility rules and provide an accepted photo ID or the listed alternative documents.",
        route:
          "Send the application with a copy of your ID to the Vital Registration Office in Charleston.",
        detail: "The state holds births from 1917; check the county clerk for earlier births.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "West Virginia: certificate request forms",
            "https://dhhr.wv.gov/HSC/forms/Pages/Certificate-Request-Forms.aspx",
          ],
          ["CDC: West Virginia record offices", "https://www.cdc.gov/nchs/w2w/west_virginia.htm"],
        ],
      },
      death: {
        url: "https://dhhr.wv.gov/HSC/VR/CR/Pages/default.aspx",
        authority: "West Virginia Vital Registration Office, Health Statistics Center",
        record:
          "Request a certified copy of the death certificate from the state Vital Registration Office.",
        access:
          "Check the office’s current eligibility rules and provide an accepted photo ID or the listed alternative documents.",
        route:
          "Send the application to the Vital Registration Office, or to the county clerk for deaths before 1917.",
        detail:
          "The state holds deaths from January 1917 and fills orders even when the cause of death is pending.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "West Virginia: change to the certified death certificate process",
            "https://health.wv.gov/article/west-virginia-department-health-announces-change-certified-death-certificate-process",
          ],
        ],
      },
      marriage: {
        url: "https://www.cdc.gov/nchs/w2w/west_virginia.htm",
        authority: "West Virginia Vital Registration Office or the county clerk",
        record:
          "Request a certified copy of the marriage certificate from the state or the county that issued the license.",
        access:
          "Check the office’s current eligibility rules; third parties need a signed permission statement.",
        route:
          "Use the state office for marriages from 1964, or the county clerk where the license was issued.",
        detail:
          "The state issues certified marriage copies only from 1964, so earlier marriages go to the county.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "West Virginia: certificate request forms",
            "https://dhhr.wv.gov/HSC/forms/Pages/Certificate-Request-Forms.aspx",
          ],
        ],
      },
      divorce: {
        url: "https://www.cdc.gov/nchs/w2w/west_virginia.htm",
        authority: "Clerk of the Circuit Court in the county that granted the divorce",
        record:
          "Request a certified copy of the divorce decree; the state does not issue certified divorce copies.",
        access:
          "Ask the circuit clerk about access, identification and certification requirements.",
        route:
          "Contact the Clerk of the Circuit Court in the county where the divorce was granted.",
        detail:
          "The state office keeps only divorce indexes, while the decree stays with the circuit court.",
        sourceChecked: "11/27/2026",
        extra: [],
      },
    },
  },
  iowa: {
    name: "Iowa",
    records: {
      birth: {
        url: "https://hhs.iowa.gov/family-community/vital-records/how-request-certified-record",
        authority: "Iowa HHS Bureau of Health Statistics, Vital Records",
        record: "Request a certified copy of the birth record from Iowa HHS or a county recorder.",
        access:
          "Check that you have a direct and tangible interest and include a government photo ID with a notarized mail application.",
        route:
          "Send the request to Iowa HHS in Des Moines, or to a county recorder for births from 1986.",
        detail:
          "The state holds records from July 1, 1880, and county recorders issue births from 1986 onward.",
        sourceChecked: "11/27/2026",
        extra: [["CDC: Iowa record offices", "https://www.cdc.gov/nchs/w2w/iowa.htm"]],
      },
      death: {
        url: "https://hhs.iowa.gov/family-community/vital-records/how-request-certified-record",
        authority: "Iowa HHS Bureau of Health Statistics, Vital Records",
        record: "Request a certified copy of the death record from Iowa HHS or a county recorder.",
        access:
          "Check the current entitlement rules and include a government photo ID with a notarized mail application.",
        route: "Send the request to Iowa HHS, or to a county recorder for deaths from 1954.",
        detail:
          "For deaths before 1954, use the county of residence or the county where the death occurred.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "State Historical Society of Iowa: vital records",
            "https://history.iowa.gov/vital-records",
          ],
        ],
      },
      marriage: {
        url: "https://hhs.iowa.gov/family-community/vital-records/how-request-certified-record",
        authority: "Iowa HHS Bureau of Health Statistics or the county recorder",
        record:
          "Request a certified copy of the marriage record from Iowa HHS or a county recorder.",
        access:
          "Check that you have a direct and tangible interest and include a government photo ID with a notarized mail application.",
        route: "Send the request to Iowa HHS, or to a county recorder for marriages from 1954.",
        detail:
          "For marriages before 1954, use the county where the marriage application was made.",
        sourceChecked: "11/27/2026",
        extra: [],
      },
      divorce: {
        url: "https://www.iowacourts.gov/for-the-public/public-records-requests",
        authority: "Clerk of District Court in the county where the case was filed",
        record:
          "Request a certified copy of the dissolution of marriage decree from the district court clerk.",
        access:
          "Ask the clerk of court about access, identification and certification requirements.",
        route: "Contact the clerk of court office in the county where the divorce case is on file.",
        detail:
          "District court case records are available through the clerk of court in the filing county.",
        sourceChecked: "11/27/2026",
        extra: [
          [
            "State Historical Society of Iowa: vital records",
            "https://history.iowa.gov/vital-records",
          ],
        ],
      },
    },
  },
  hawaii: {
    name: "Hawaii",
    records: {
      birth: {
        url: "https://vitrec.ehawaii.gov/vitalrecords/",
        authority: "Hawaii State Department of Health, Office of Health Status Monitoring",
        record:
          "Request a certified copy of the birth certificate for a birth that occurred in Hawaii.",
        access:
          "Check that you qualify under state law; online orders are limited to your own record or an immediate family member’s.",
        route:
          "Order from the Department of Health through its online vital records ordering system, or by mail or in person.",
        detail: "The online system covers birth certificates from July 1909 to the present.",
        sourceChecked: "11/27/2026",
        extra: [["CDC: Hawaii record offices", "https://www.cdc.gov/nchs/w2w/hawaii.htm"]],
      },
      death: {
        url: "https://www.cdc.gov/nchs/w2w/hawaii.htm",
        authority: "Hawaii State Department of Health, Vital Records Section",
        record:
          "Request a certified copy of the death certificate for a death that occurred in Hawaii.",
        access:
          "Check the office’s current eligibility and identification requirements before you apply.",
        route:
          "Send the request to the Department of Health Vital Records Section by mail or in person, not through the online portal.",
        detail:
          "The state’s online ordering system handles birth and marriage records, so death certificates follow the mail or in-person process.",
        sourceChecked: "11/27/2026",
        extra: [
          ["Hawaii vital records ordering: about", "https://vitrec.ehawaii.gov/vitalrecords/about"],
        ],
      },
      marriage: {
        url: "https://vitrec.ehawaii.gov/vitalrecords/",
        authority: "Hawaii State Department of Health, Office of Health Status Monitoring",
        record: "Request a certified copy of the marriage or civil union certificate.",
        access:
          "Check that you qualify under state law; online orders are limited to your own record or an immediate family member’s.",
        route: "Order from the state Department of Health, not a county office.",
        detail:
          "The online system covers marriage and civil union certificates from July 1909 to the present.",
        sourceChecked: "11/27/2026",
        extra: [["CDC: Hawaii record offices", "https://www.cdc.gov/nchs/w2w/hawaii.htm"]],
      },
      divorce: {
        url: "https://www.cdc.gov/nchs/w2w/hawaii.htm",
        authority:
          "Hawaii State Judiciary, Family Court of the circuit where the divorce was granted",
        record: "Request a certified copy of the divorce decree from the court that granted it.",
        access: "Ask the court about access, identification and certification requirements.",
        route: "Contact the court in the circuit where the divorce was granted.",
        detail:
          "Divorce copies follow the court process, rather than the state birth, death and marriage ordering system.",
        sourceChecked: "11/27/2026",
        extra: [],
      },
    },
  },
  "north-dakota": {
    name: "North Dakota",
    records: {
      birth: {
        url: "https://www.hhs.nd.gov/vital/birth",
        authority: "North Dakota Department of Health and Human Services, Vital Records",
        record:
          "Request a certified copy of the birth record; the office does not issue uncertified copies.",
        access:
          "Check that you are the registrant aged 16 or older, a parent named on the record, or have a court order or authorization, and include an unexpired photo ID.",
        route:
          "Order from the state Vital Records office online, by mail, or by appointment in person.",
        detail:
          "The state holds birth records from 1870, though records from 1870 to 1920 are incomplete.",
        sourceChecked: "11/27/2026",
        extra: [
          ["North Dakota: birth records by mail", "https://www.hhs.nd.gov/vital/birthbymail"],
          ["CDC: North Dakota record offices", "https://www.cdc.gov/nchs/w2w/north_dakota.htm"],
        ],
      },
      death: {
        url: "https://www.hhs.nd.gov/vital/death",
        authority: "North Dakota Department of Health and Human Services, Vital Records",
        record:
          "Choose between a complete record with cause of death, a facts of death record, or an informational record.",
        access:
          "Check which record type you qualify for; complete records are limited to relatives, authorized representatives, funeral directors and court orders.",
        route:
          "Order from the state Vital Records office online, by mail, or by appointment in person.",
        detail:
          "The state holds death records from July 1893, though records from 1894 to 1920 are incomplete.",
        sourceChecked: "11/27/2026",
        extra: [
          ["CDC: North Dakota record offices", "https://www.cdc.gov/nchs/w2w/north_dakota.htm"],
        ],
      },
      marriage: {
        url: "https://www.hhs.nd.gov/vital/marriage",
        authority: "County office where the marriage license was purchased and filed",
        record:
          "Obtain a certified copy of the marriage record from the county that issued the license.",
        access:
          "Ask the county office about access, identification and certification requirements.",
        route:
          "Contact the county office where the license was filed, which may be the recorder, clerk of court or another county office.",
        detail: "The state stopped issuing certified marriage copies on January 1, 2008.",
        sourceChecked: "11/27/2026",
        extra: [
          ["CDC: North Dakota record offices", "https://www.cdc.gov/nchs/w2w/north_dakota.htm"],
        ],
      },
      divorce: {
        url: "https://www.hhs.nd.gov/vital/divorce",
        authority: "Clerk of court or county recorder in the county where the divorce was granted",
        record:
          "Request a certified copy of the divorce or annulment record from the county that granted it.",
        access:
          "Ask the county office about access, identification and certification requirements.",
        route:
          "Contact the county clerk or recorder in the county where the divorce or annulment was granted.",
        detail:
          "The state does not issue divorce copies, but Vital Records can help identify the right county.",
        sourceChecked: "11/27/2026",
        extra: [
          ["CDC: North Dakota record offices", "https://www.cdc.gov/nchs/w2w/north_dakota.htm"],
        ],
      },
    },
  },
} as const;
