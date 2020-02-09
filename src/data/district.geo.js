export function getDistrictDataList(province) {
    return districtDataList[province].map(district => {
        district.properties.NAME_T = district.properties.NAME_T.replace('อำเภอ', '');
        district.properties.CATEGORY = 0;

        const lat = district.geometry.coordinates[1];
        const lng = district.geometry.coordinates[0];
        district.properties.DESCRIPTION_T = `อ.${district.properties.NAME_T} จ.${district.properties.CHANGWAT_T}`;
        district.properties.LOCATION_T = `ละติจูด ${lat.toFixed(6)}, ลองจิจูด ${lng.toFixed(6)}`;

        return district;
    });
}

const districtDataList = [
    /*นครปฐม*/
    [
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 65698,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอสามพราน",
                "NAME_E": "AMPHOE SAM PHRAN",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2012\/06\/30",
                "TAMBON_T": "สามพราน",
                "TAMBON_E": "Sam Phran",
                "AMPHOE_T": "สามพราน",
                "AMPHOE_E": "Sam Phran",
                "CHANGWAT_T": "นครปฐม",
                "CHANGWAT_E": "Nakhon Pathom",
                "TA_ID": 730606,
                "RE_NESDB": "West",
                "RE_ROYIN": "Central"
            },
            "geometry": {"type": "Point", "coordinates": [100.216693012010566, 13.724126628439073]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 65699,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอนครชัยศรี",
                "NAME_E": "AMPHOE NAKHON CHAISI",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2012\/06\/30",
                "TAMBON_T": "นครชัยศรี",
                "TAMBON_E": "Nakhon Chai Si",
                "AMPHOE_T": "นครชัยศรี",
                "AMPHOE_E": "Nakhon Chai Si",
                "CHANGWAT_T": "นครปฐม",
                "CHANGWAT_E": "Nakhon Pathom",
                "TA_ID": 730301,
                "RE_NESDB": "West",
                "RE_ROYIN": "Central"
            },
            "geometry": {"type": "Point", "coordinates": [100.187766354200335, 13.801070399925067]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 65700,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอพุทธมณฑล",
                "NAME_E": "AMPHOE PHUTTAMONTHON",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2012\/06\/30",
                "TAMBON_T": "ศาลายา",
                "TAMBON_E": "Sala Ya",
                "AMPHOE_T": "พุทธมณฑล",
                "AMPHOE_E": "Phutthamonthon",
                "CHANGWAT_T": "นครปฐม",
                "CHANGWAT_E": "Nakhon Pathom",
                "TA_ID": 730701,
                "RE_NESDB": "West",
                "RE_ROYIN": "Central"
            },
            "geometry": {"type": "Point", "coordinates": [100.321373658852451, 13.801847059857344]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 65701,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอเมืองนครปฐม",
                "NAME_E": "AMPHOE MUEANG NAKHON PATHOM",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2012\/06\/30",
                "TAMBON_T": "พระปฐมเจดีย์",
                "TAMBON_E": "Phra Pathom Chedi",
                "AMPHOE_T": "เมืองนครปฐม",
                "AMPHOE_E": "mueang Nakhon Pathom",
                "CHANGWAT_T": "นครปฐม",
                "CHANGWAT_E": "Nakhon Pathom",
                "TA_ID": 730101,
                "RE_NESDB": "West",
                "RE_ROYIN": "Central"
            },
            "geometry": {"type": "Point", "coordinates": [100.065887808231082, 13.819662931427004]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 65702,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอดอนตูม",
                "NAME_E": "AMPHOE DON TUM",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2012\/06\/30",
                "TAMBON_T": "สามง่าม",
                "TAMBON_E": "Sam Ngam",
                "AMPHOE_T": "ดอนตูม",
                "AMPHOE_E": "Don Tum",
                "CHANGWAT_T": "นครปฐม",
                "CHANGWAT_E": "Nakhon Pathom",
                "TA_ID": 730401,
                "RE_NESDB": "West",
                "RE_ROYIN": "Central"
            },
            "geometry": {"type": "Point", "coordinates": [100.081205861619296, 13.960559222969884]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 65703,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอกำแพงแสน",
                "NAME_E": "AMPHOE KAM PHAENG SAEN",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2012\/06\/30",
                "TAMBON_T": "ทุ่งกระพังโหม",
                "TAMBON_E": "Thung Kraphang Hom",
                "AMPHOE_T": "กำแพงแสน",
                "AMPHOE_E": "Kamphaeng Saen",
                "CHANGWAT_T": "นครปฐม",
                "CHANGWAT_E": "Nakhon Pathom",
                "TA_ID": 730201,
                "RE_NESDB": "West",
                "RE_ROYIN": "Central"
            },
            "geometry": {"type": "Point", "coordinates": [99.993733000516769, 13.983893680820383]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 65704,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอบางเลน",
                "NAME_E": "AMPHOE BANG LEN",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2012\/06\/30",
                "TAMBON_T": "บางเลน",
                "TAMBON_E": "Bang Len",
                "AMPHOE_T": "บางเลน",
                "AMPHOE_E": "Bang Len",
                "CHANGWAT_T": "นครปฐม",
                "CHANGWAT_E": "Nakhon Pathom",
                "TA_ID": 730501,
                "RE_NESDB": "West",
                "RE_ROYIN": "Central"
            },
            "geometry": {"type": "Point", "coordinates": [100.16551127752281, 14.021502687592438]}
        }
    ],

    /*ยโสธร*/
    [
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 45001,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอค้อวัง",
                "NAME_E": "AMPHOE KHO WANG",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2011\/06\/30",
                "TAMBON_T": "ค้อวัง",
                "TAMBON_E": "Kho Wang",
                "AMPHOE_T": "ค้อวัง",
                "AMPHOE_E": "Kho Wang",
                "CHANGWAT_T": "ยโสธร",
                "CHANGWAT_E": "Yasothon",
                "TA_ID": 350704,
                "RE_NESDB": "Northeast",
                "RE_ROYIN": "Northeast"
            },
            "geometry": {"type": "Point", "coordinates": [104.35749999871534, 15.367399999643208]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 45003,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอมหาชนะชัย",
                "NAME_E": "AMPHOE MAHA CHANAPHAI",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2011\/06\/30",
                "TAMBON_T": "ฟ้าหยาด",
                "TAMBON_E": "Fa Yat",
                "AMPHOE_T": "มหาชนะชัย",
                "AMPHOE_E": "Maha Chana Chai",
                "CHANGWAT_T": "ยโสธร",
                "CHANGWAT_E": "Yasothon",
                "TA_ID": 350601,
                "RE_NESDB": "Northeast",
                "RE_ROYIN": "Northeast"
            },
            "geometry": {"type": "Point", "coordinates": [104.242499999112724, 15.532483333744221]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 45004,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอคำเขื่อนแก้ว",
                "NAME_E": "AMPHOE KHAM KHUAN KAEO",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2011\/06\/30",
                "TAMBON_T": "ลุมพุก",
                "TAMBON_E": "Lumphuk",
                "AMPHOE_T": "คำเขื่อนแก้ว",
                "AMPHOE_E": "Kham Khuean Kaeo",
                "CHANGWAT_T": "ยโสธร",
                "CHANGWAT_E": "Yasothon",
                "TA_ID": 350401,
                "RE_NESDB": "Northeast",
                "RE_ROYIN": "Northeast"
            },
            "geometry": {"type": "Point", "coordinates": [104.30878333216279, 15.652833333650243]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 45005,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอเมืองยโสธร",
                "NAME_E": "AMPHOE MUEANG YASOTHON",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2011\/06\/30",
                "TAMBON_T": "ในเมือง",
                "TAMBON_E": "Nai Mueang",
                "AMPHOE_T": "เมืองยโสธร",
                "AMPHOE_E": "Mueang Yasothon",
                "CHANGWAT_T": "ยโสธร",
                "CHANGWAT_E": "Yasothon",
                "TA_ID": 350101,
                "RE_NESDB": "Northeast",
                "RE_ROYIN": "Northeast"
            },
            "geometry": {"type": "Point", "coordinates": [104.140616666943984, 15.794666666606563]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 45006,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอป่าติ้ว",
                "NAME_E": "AMPHOE PATIW",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2011\/06\/30",
                "TAMBON_T": "โพธิ์ไทร",
                "TAMBON_E": "Pho Sai",
                "AMPHOE_T": "ป่าติ้ว",
                "AMPHOE_E": "Pa Tio",
                "CHANGWAT_T": "ยโสธร",
                "CHANGWAT_E": "Yasothon",
                "TA_ID": 350501,
                "RE_NESDB": "Northeast",
                "RE_ROYIN": "Northeast"
            },
            "geometry": {"type": "Point", "coordinates": [104.385483332784673, 15.831333333523226]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 45007,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอทรายมูล",
                "NAME_E": "AMPHOE SAIMUN",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2011\/06\/30",
                "TAMBON_T": "ทรายมูล",
                "TAMBON_E": "Sai Mun",
                "AMPHOE_T": "ทรายมูล",
                "AMPHOE_E": "Sai Mun",
                "CHANGWAT_T": "ยโสธร",
                "CHANGWAT_E": "Yasothon",
                "TA_ID": 350201,
                "RE_NESDB": "Northeast",
                "RE_ROYIN": "Northeast"
            },
            "geometry": {"type": "Point", "coordinates": [104.208999999933866, 15.939766666998015]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 45008,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอกุดชุม",
                "NAME_E": "AMPHOE KUTCHOM",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2011\/06\/30",
                "TAMBON_T": "กุดชุม",
                "TAMBON_E": "Kut Chum",
                "AMPHOE_T": "กุดชุม",
                "AMPHOE_E": "Kut Chum",
                "CHANGWAT_T": "ยโสธร",
                "CHANGWAT_E": "Yasothon",
                "TA_ID": 350301,
                "RE_NESDB": "Northeast",
                "RE_ROYIN": "Northeast"
            },
            "geometry": {"type": "Point", "coordinates": [104.338583332729982, 16.032783333248737]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 45009,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอไทยเจริญ",
                "NAME_E": "AMPHOE THAICHAROEN",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2011\/06\/30",
                "TAMBON_T": "ไทยเจริญ",
                "TAMBON_E": "Thai Charoen",
                "AMPHOE_T": "ไทยเจริญ",
                "AMPHOE_E": "Thai Charoen",
                "CHANGWAT_T": "ยโสธร",
                "CHANGWAT_E": "Yasothon",
                "TA_ID": 350901,
                "RE_NESDB": "Northeast",
                "RE_ROYIN": "Northeast"
            },
            "geometry": {"type": "Point", "coordinates": [104.447449998974605, 16.063183332992306]}
        },
        {
            "type": "Feature",
            "properties": {
                "OBJECTID": 45010,
                "LM_group": 500,
                "LM_type": "500002",
                "NAME_T": "อำเภอเลิงนกทา",
                "NAME_E": "AMPHOE LUANG NOK THA",
                "Scale": "25000",
                "Source_nam": "GISTDA",
                "Source_dat": "2011\/06\/30",
                "TAMBON_T": "สามแยก",
                "TAMBON_E": "Sam Yaek",
                "AMPHOE_T": "เลิงนกทา",
                "AMPHOE_E": "Loeng Nok Tha",
                "CHANGWAT_T": "ยโสธร",
                "CHANGWAT_E": "Yasothon",
                "TA_ID": 350810,
                "RE_NESDB": "Northeast",
                "RE_ROYIN": "Northeast"
            },
            "geometry": {"type": "Point", "coordinates": [104.554849999315053, 16.207766666524684]}
        }
    ]
];