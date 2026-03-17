// ============================================================
//  Pakistan BISE Boards — Complete Data + Dynamic Status Logic
// ============================================================

// ── Dynamic year — auto forever ───────────────────────────
export const CURRENT_YEAR = new Date().getFullYear();

// ── Auto status by month (fallback when DB has no data) ───
// Based on historical Pakistan board result patterns
export function getAutoStatus(boardId, classType) {
  const month = new Date().getMonth() + 1; // 1-12
  const province = BOARDS.find(b => b.id === boardId)?.province || "Punjab";

  // Punjab, KPK, Federal boards typical pattern
  const isPunjabType = ["Punjab", "KPK", "Federal", "AJK"].includes(province);
  // Sindh, Balochistan, GB typically 1-2 months later
  const isSindhType  = ["Sindh", "Balochistan", "Gilgit-Baltistan"].includes(province);

  if (classType === "matric") {
    if (month >= 1  && month <= 3)  return { status:"off_season",  label:"📚 Exams in Progress",     color:"#64748b" };
    if (month >= 4  && month <= 6)  return { status:"expected",    label:"⏳ Results Expected Soon",  color:"#d97706" };
    if (isPunjabType && month >= 7  && month <= 8)  return { status:"announced", label:"🔴 Results Announced!",      color:"#dc2626" };
    if (isSindhType  && month >= 8  && month <= 10) return { status:"announced", label:"🔴 Results Announced!",      color:"#dc2626" };
    if (month >= 9  && month <= 12) return { status:"off_season",  label:"📚 Next Session Preparing", color:"#64748b" };
  }

  if (classType === "inter") {
    if (month >= 1  && month <= 5)  return { status:"off_season",  label:"📚 Exams in Progress",     color:"#64748b" };
    if (month >= 6  && month <= 8)  return { status:"expected",    label:"⏳ Results Expected Soon",  color:"#d97706" };
    if (isPunjabType && month >= 9  && month <= 11) return { status:"announced", label:"🔴 Results Announced!",      color:"#dc2626" };
    if (isSindhType  && month >= 10 && month <= 12) return { status:"announced", label:"🔴 Results Announced!",      color:"#dc2626" };
    if (month === 12) return { status:"off_season",  label:"📚 Next Session Preparing", color:"#64748b" };
  }

  return { status:"expected", label:"⏳ Results Expected", color:"#d97706" };
}

// ── Expected result dates by province (typical months) ────
export function getExpectedDate(boardId, classType) {
  const year     = CURRENT_YEAR;
  const province = BOARDS.find(b => b.id === boardId)?.province || "Punjab";
  const isPunjab = ["Punjab", "KPK", "Federal", "AJK"].includes(province);

  if (classType === "matric") {
    return isPunjab
      ? new Date(`${year}-07-20`) // Typical mid-July
      : new Date(`${year}-08-20`); // Sindh/others mid-Aug
  }
  if (classType === "inter") {
    return isPunjab
      ? new Date(`${year}-10-15`) // Typical mid-Oct
      : new Date(`${year}-11-15`); // Sindh/others mid-Nov
  }
  return null;
}

// ── Countdown calculator ───────────────────────────────────
export function getCountdown(targetDate) {
  if (!targetDate) return null;
  const now  = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes, totalMs: diff };
}

// ── Merge DB data with auto status ────────────────────────
export function getMergedStatus(boardId, classType, dbAnnouncement) {
  const autoStatus = getAutoStatus(boardId, classType);
  const expected   = getExpectedDate(boardId, classType);

  if (!dbAnnouncement) {
    return { ...autoStatus, expectedDate: expected, announcedDate: null, resultUrl: null, fromDB: false };
  }

  const prefix = classType === "matric" ? "matric" : "inter";
  const dbStatus        = dbAnnouncement[`${prefix}_status`];
  const dbAnnounced     = dbAnnouncement[`${prefix}_announced_date`];
  const dbExpected      = dbAnnouncement[`${prefix}_expected_date`];
  const dbUrl           = dbAnnouncement[`${prefix}_result_url`];

  // DB data takes priority over auto-detection
  if (dbStatus === "announced") {
    return {
      status:       "announced",
      label:        "🔴 Results Announced!",
      color:        "#dc2626",
      announcedDate: dbAnnounced ? new Date(dbAnnounced) : null,
      expectedDate:  null,
      resultUrl:     dbUrl || null,
      fromDB:        true,
    };
  }

  if (dbExpected) {
    return {
      ...autoStatus,
      expectedDate: new Date(dbExpected),
      announcedDate: null,
      resultUrl:    dbUrl || null,
      fromDB:       true,
    };
  }

  return { ...autoStatus, expectedDate: expected, announcedDate: null, resultUrl: dbUrl || null, fromDB: false };
}

// ── All boards data ────────────────────────────────────────
export const BOARDS = [
  // ── PUNJAB ────────────────────────────────────────────
  {
    id:"bise-lahore", name:"BISE Lahore",
    fullName:"Board of Intermediate and Secondary Education Lahore",
    province:"Punjab", city:"Lahore", established:1954,
    url:"https://www.biserlp.com",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce","Computer Science"],
    emoji:"🏛️", color:"#1a3a8f",
    districts:["Lahore","Sheikhupura","Nankana Sahib"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit biserlp.com","Click Result in navigation","Select exam type (Matric/Inter)","Select the year","Enter your Roll Number","Click Submit","View and save your result"],
    faqs:[
      {q:`When does BISE Lahore announce Matric results ${CURRENT_YEAR}?`,a:`BISE Lahore typically announces Matric (SSC) results in July or August ${CURRENT_YEAR}.`},
      {q:`When does BISE Lahore announce Inter results ${CURRENT_YEAR}?`,a:`Intermediate (HSSC) results are usually announced in October or November ${CURRENT_YEAR}.`},
      {q:"How do I get my mark sheet?",a:"Mark sheets are issued through your school/college after result declaration."},
      {q:"Can I apply for rechecking?",a:"Yes, within 15 days of result announcement. Visit biserlp.com for forms."},
    ],
  },
  {
    id:"bise-gujranwala", name:"BISE Gujranwala",
    fullName:"Board of Intermediate and Secondary Education Gujranwala",
    province:"Punjab", city:"Gujranwala", established:1958,
    url:"https://www.bisegrw.com",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#1a3a8f",
    districts:["Gujranwala","Sialkot","Gujrat","Hafizabad","Narowal","Mandi Bahauddin"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit bisegrw.com","Go to Result section","Select class and year","Enter Roll Number","Submit to view result"],
    faqs:[
      {q:`When does BISE Gujranwala announce results ${CURRENT_YEAR}?`,a:`Matric in July-August ${CURRENT_YEAR}, Intermediate in October-November ${CURRENT_YEAR}.`},
      {q:"Which districts are under BISE Gujranwala?",a:"Gujranwala, Sialkot, Gujrat, Hafizabad, Narowal, Mandi Bahauddin."},
    ],
  },
  {
    id:"bise-faisalabad", name:"BISE Faisalabad",
    fullName:"Board of Intermediate and Secondary Education Faisalabad",
    province:"Punjab", city:"Faisalabad", established:1977,
    url:"https://www.bisefsd.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#1a3a8f",
    districts:["Faisalabad","Jhang","Toba Tek Singh","Chiniot"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit bisefsd.edu.pk","Click Result","Select class and year","Enter Roll Number","View result"],
    faqs:[{q:`When are BISE Faisalabad results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-rawalpindi", name:"BISE Rawalpindi",
    fullName:"Board of Intermediate and Secondary Education Rawalpindi",
    province:"Punjab", city:"Rawalpindi", established:1977,
    url:"https://www.biserawalpindi.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#1a3a8f",
    districts:["Rawalpindi","Attock","Chakwal","Jhelum"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Open biserawalpindi.edu.pk","Go to Results","Select exam and year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BISE Rawalpindi announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-multan", name:"BISE Multan",
    fullName:"Board of Intermediate and Secondary Education Multan",
    province:"Punjab", city:"Multan", established:1968,
    url:"https://www.bisemultan.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#1a3a8f",
    districts:["Multan","Lodhran","Khanewal","Vehari"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit bisemultan.edu.pk","Click Result","Select class and year","Enter Roll Number","View result"],
    faqs:[{q:`When does BISE Multan announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-sahiwal", name:"BISE Sahiwal",
    fullName:"Board of Intermediate and Secondary Education Sahiwal",
    province:"Punjab", city:"Sahiwal", established:1983,
    url:"https://www.bisesahiwal.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#1a3a8f",
    districts:["Sahiwal","Okara","Pakpattan"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit bisesahiwal.edu.pk","Go to Results","Select class and year","Enter Roll Number","Submit"],
    faqs:[{q:`When are BISE Sahiwal results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-dgkhan", name:"BISE DG Khan",
    fullName:"Board of Intermediate and Secondary Education Dera Ghazi Khan",
    province:"Punjab", city:"Dera Ghazi Khan", established:1989,
    url:"https://www.bisedgkhan.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#1a3a8f",
    districts:["DG Khan","Rajanpur","Layyah","Muzaffargarh"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Open bisedgkhan.edu.pk","Select Results","Choose class and year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BISE DG Khan announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-sargodha", name:"BISE Sargodha",
    fullName:"Board of Intermediate and Secondary Education Sargodha",
    province:"Punjab", city:"Sargodha", established:1977,
    url:"https://www.bisesargodha.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#1a3a8f",
    districts:["Sargodha","Khushab","Mianwali","Bhakkar"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit bisesargodha.edu.pk","Go to Results","Select class and year","Enter Roll Number","View result"],
    faqs:[{q:`When are BISE Sargodha results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-bahawalpur", name:"BISE Bahawalpur",
    fullName:"Board of Intermediate and Secondary Education Bahawalpur",
    province:"Punjab", city:"Bahawalpur", established:1977,
    url:"https://www.bisebwp.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#1a3a8f",
    districts:["Bahawalpur","Bahawalnagar","Rahim Yar Khan"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Go to bisebwp.edu.pk","Click Results","Select exam and year","Enter Roll Number","View result"],
    faqs:[{q:`When does BISE Bahawalpur announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  // ── KPK ──────────────────────────────────────────────
  {
    id:"bise-peshawar", name:"BISE Peshawar",
    fullName:"Board of Intermediate and Secondary Education Peshawar",
    province:"KPK", city:"Peshawar", established:1961,
    url:"https://www.bisep.com.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce","General"],
    emoji:"🏛️", color:"#166534",
    districts:["Peshawar","Charsadda","Nowshera","Khyber"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit bisep.com.pk","Click Result menu","Select Matric or Inter","Choose year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BISE Peshawar announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-mardan", name:"BISE Mardan",
    fullName:"Board of Intermediate and Secondary Education Mardan",
    province:"KPK", city:"Mardan", established:1988,
    url:"https://www.bisemardan.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#166534",
    districts:["Mardan","Swabi"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Open bisemardan.edu.pk","Go to Results","Select class and year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BISE Mardan announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-abbottabad", name:"BISE Abbottabad",
    fullName:"Board of Intermediate and Secondary Education Abbottabad",
    province:"KPK", city:"Abbottabad", established:1987,
    url:"https://www.biseatd.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#166534",
    districts:["Abbottabad","Mansehra","Battagram","Kohistan","Tor Ghar"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit biseatd.edu.pk","Click Results","Select exam type and year","Enter Roll Number","View result"],
    faqs:[{q:`When does BISE Abbottabad announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-bannu", name:"BISE Bannu",
    fullName:"Board of Intermediate and Secondary Education Bannu",
    province:"KPK", city:"Bannu", established:1995,
    url:"https://www.bisebannu.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#166534",
    districts:["Bannu","Lakki Marwat","Karak","North Waziristan"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Go to bisebannu.edu.pk","Navigate to Results","Choose class and year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BISE Bannu announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-swat", name:"BISE Swat",
    fullName:"Board of Intermediate and Secondary Education Swat",
    province:"KPK", city:"Swat", established:1998,
    url:"https://www.biseswat.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#166534",
    districts:["Swat","Buner","Dir Upper","Dir Lower","Chitral"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit biseswat.edu.pk","Click Result","Select class and year","Enter Roll Number","View result"],
    faqs:[{q:`When does BISE Swat announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-kohat", name:"BISE Kohat",
    fullName:"Board of Intermediate and Secondary Education Kohat",
    province:"KPK", city:"Kohat", established:1994,
    url:"https://www.bisekohat.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#166534",
    districts:["Kohat","Hangu","Orakzai","Kurram"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Open bisekohat.edu.pk","Select Results","Choose class and year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BISE Kohat announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-malakand", name:"BISE Malakand",
    fullName:"Board of Intermediate and Secondary Education Malakand",
    province:"KPK", city:"Malakand", established:2012,
    url:"https://www.bisemalakand.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#166534",
    districts:["Malakand","Shangla"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit bisemalakand.edu.pk","Go to Result","Select class and year","Enter Roll Number","View result"],
    faqs:[{q:`When does BISE Malakand announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-dikhankpk", name:"BISE DI Khan",
    fullName:"Board of Intermediate and Secondary Education Dera Ismail Khan",
    province:"KPK", city:"Dera Ismail Khan", established:1994,
    url:"https://www.bisedik.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#166534",
    districts:["DI Khan","Tank","South Waziristan"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Go to bisedik.edu.pk","Click Results","Choose class and year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BISE DI Khan announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  // ── SINDH ──────────────────────────────────────────────
  {
    id:"bise-karachi", name:"BISE Karachi",
    fullName:"Board of Intermediate and Secondary Education Karachi",
    province:"Sindh", city:"Karachi", established:1952,
    url:"https://www.bisek.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce","Home Economics"],
    emoji:"🏛️", color:"#dc2626",
    districts:["Karachi East","Karachi West","Karachi Central","Karachi South","Malir","Korangi"],
    resultMonths:{ matric:"August - September", inter:"November - December" },
    howToCheck:["Visit bisek.edu.pk","Click Result Portal","Select class (Matric/Inter)","Enter Roll Number","Click View Result","Download result"],
    faqs:[
      {q:`When does BISE Karachi announce results ${CURRENT_YEAR}?`,a:`Matric results in August-September ${CURRENT_YEAR}, Intermediate in November-December ${CURRENT_YEAR}.`},
      {q:"Which areas are under BISE Karachi?",a:"All six districts of Karachi city."},
    ],
  },
  {
    id:"bise-hyderabad", name:"BISE Hyderabad",
    fullName:"Board of Intermediate and Secondary Education Hyderabad",
    province:"Sindh", city:"Hyderabad", established:1958,
    url:"https://www.bisehyd.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#dc2626",
    districts:["Hyderabad","Jamshoro","Matiari","Tando Allahyar","Tando Muhammad Khan"],
    resultMonths:{ matric:"August - September", inter:"November - December" },
    howToCheck:["Open bisehyd.edu.pk","Navigate to Results","Select class and year","Enter Roll Number","View result"],
    faqs:[{q:`When does BISE Hyderabad announce results ${CURRENT_YEAR}?`,a:`Matric August-September ${CURRENT_YEAR}, Inter November-December ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-sukkur", name:"BISE Sukkur",
    fullName:"Board of Intermediate and Secondary Education Sukkur",
    province:"Sindh", city:"Sukkur", established:1973,
    url:"https://www.bisesukkur.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#dc2626",
    districts:["Sukkur","Ghotki","Khairpur"],
    resultMonths:{ matric:"August - September", inter:"November - December" },
    howToCheck:["Visit bisesukkur.edu.pk","Go to Results","Choose class and year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BISE Sukkur announce results ${CURRENT_YEAR}?`,a:`Matric August-September ${CURRENT_YEAR}, Inter November-December ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-larkana", name:"BISE Larkana",
    fullName:"Board of Intermediate and Secondary Education Larkana",
    province:"Sindh", city:"Larkana", established:1978,
    url:"https://www.biselarkana.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#dc2626",
    districts:["Larkana","Shikarpur","Jacobabad","Kashmore","Qambar-Shahdadkot"],
    resultMonths:{ matric:"August - September", inter:"November - December" },
    howToCheck:["Open biselarkana.edu.pk","Click Results","Select class and year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BISE Larkana announce results ${CURRENT_YEAR}?`,a:`Matric August-September ${CURRENT_YEAR}, Inter November-December ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-mirpurkhas", name:"BISE Mirpurkhas",
    fullName:"Board of Intermediate and Secondary Education Mirpurkhas",
    province:"Sindh", city:"Mirpurkhas", established:1978,
    url:"https://www.bisemirpurkhas.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#dc2626",
    districts:["Mirpurkhas","Umerkot","Tharparkar","Sanghar"],
    resultMonths:{ matric:"August - September", inter:"November - December" },
    howToCheck:["Visit bisemirpurkhas.edu.pk","Go to Results","Select class and year","Enter Roll Number","View result"],
    faqs:[{q:`When does BISE Mirpurkhas announce results ${CURRENT_YEAR}?`,a:`Matric August-September ${CURRENT_YEAR}, Inter November-December ${CURRENT_YEAR}.`}],
  },
  // ── BALOCHISTAN ────────────────────────────────────────
  {
    id:"bise-quetta", name:"BBISE Quetta",
    fullName:"Balochistan Board of Intermediate and Secondary Education Quetta",
    province:"Balochistan", city:"Quetta", established:1977,
    url:"https://www.bisequetta.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce","General"],
    emoji:"🏛️", color:"#7c3aed",
    districts:["Quetta","Pishin","Killa Abdullah","Chagai","Nushki","Kharan"],
    resultMonths:{ matric:"August - September", inter:"November - December" },
    howToCheck:["Visit bisequetta.edu.pk","Click Result","Select exam class and year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BBISE Quetta announce results ${CURRENT_YEAR}?`,a:`Matric August-September ${CURRENT_YEAR}, Inter November-December ${CURRENT_YEAR}.`}],
  },
  // ── FEDERAL / OTHER ────────────────────────────────────
  {
    id:"fbise-islamabad", name:"FBISE Islamabad",
    fullName:"Federal Board of Intermediate and Secondary Education Islamabad",
    province:"Federal", city:"Islamabad", established:1975,
    url:"https://www.fbise.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)","O-Level","A-Level"],
    subjects:["Science","Arts","Commerce","Computer Science","General Science"],
    emoji:"🏛️", color:"#0284c7",
    districts:["Islamabad Capital Territory","Overseas Pakistan Students","Cantonment areas nationwide"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Go to fbise.edu.pk","Click Result in main menu","Select examination type","Choose session/year","Enter Roll Number or Registration Number","Click Submit","Download PDF result card"],
    faqs:[
      {q:`When does FBISE announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Intermediate October-November ${CURRENT_YEAR}.`},
      {q:"Who can appear in FBISE exams?",a:"Students from Islamabad, cantonments nationwide, overseas Pakistanis and affiliated private institutions."},
      {q:"Does FBISE conduct O-Level/A-Level?",a:"Yes, FBISE conducts equivalence certificates for O/A Level and has its own SSC/HSSC examinations."},
    ],
  },
  {
    id:"bise-ajk", name:"BISE AJK",
    fullName:"Board of Intermediate and Secondary Education Azad Jammu & Kashmir",
    province:"AJK", city:"Mirpur", established:1974,
    url:"https://www.biseak.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#0284c7",
    districts:["Mirpur","Bhimber","Kotli","Muzaffarabad","Bagh","Rawalakot","Neelum"],
    resultMonths:{ matric:"July - August", inter:"October - November" },
    howToCheck:["Visit biseak.edu.pk","Go to Result section","Select class and year","Enter Roll Number","Submit"],
    faqs:[{q:`When does BISE AJK announce results ${CURRENT_YEAR}?`,a:`Matric July-August ${CURRENT_YEAR}, Inter October-November ${CURRENT_YEAR}.`}],
  },
  {
    id:"bise-gilgit", name:"BISE Gilgit",
    fullName:"Board of Intermediate and Secondary Education Gilgit-Baltistan",
    province:"Gilgit-Baltistan", city:"Gilgit", established:1990,
    url:"https://www.bisegb.edu.pk",
    classes:["Matric (9th & 10th)","Intermediate (11th & 12th)"],
    subjects:["Science","Arts","Commerce"],
    emoji:"🏛️", color:"#0284c7",
    districts:["Gilgit","Hunza","Nagar","Ghizer","Skardu","Shigar","Ghanche","Astore","Diamer"],
    resultMonths:{ matric:"August - September", inter:"November - December" },
    howToCheck:["Visit bisegb.edu.pk","Click Results","Select class and year","Enter Roll Number","View result"],
    faqs:[{q:`When does BISE Gilgit-Baltistan announce results ${CURRENT_YEAR}?`,a:`Matric August-September ${CURRENT_YEAR}, Inter November-December ${CURRENT_YEAR}.`}],
  },
];

export function getBoardById(id)         { return BOARDS.find(b => b.id === id) || null; }
export function getBoardsByProvince(prov){ return BOARDS.filter(b => b.province === prov); }

export const PROVINCES = ["Punjab","KPK","Sindh","Balochistan","Federal","AJK","Gilgit-Baltistan"];

export const PROVINCE_COLORS = {
  "Punjab":"#1a3a8f","KPK":"#166534","Sindh":"#dc2626",
  "Balochistan":"#7c3aed","Federal":"#0284c7","AJK":"#0284c7","Gilgit-Baltistan":"#0284c7",
};

export const PROVINCE_EMOJIS = {
  "Punjab":"🟦","KPK":"🟩","Sindh":"🟥","Balochistan":"🟪",
  "Federal":"🔵","AJK":"🔵","Gilgit-Baltistan":"🔵",
};