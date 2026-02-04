
export interface LocationUnit {
    code: string;
    name: string;
}

export interface District extends LocationUnit {
    wards: LocationUnit[];
}

export interface Province extends LocationUnit {
    districts: District[];
}

// Sample data focusing on major cities as requested. 
// In a full production app, this would be fetched from an API or a large JSON file.
export const VN_LOCATIONS: Province[] = [
    {
        code: "01", name: "Hà Nội",
        districts: [
            { code: "001", name: "Quận Ba Đình", wards: [{ code: "00001", name: "Phường Phúc Xá" }, { code: "00004", name: "Phường Trúc Bạch" }, { code: "00006", name: "Phường Vĩnh Phúc" }] },
            { code: "002", name: "Quận Hoàn Kiếm", wards: [{ code: "00037", name: "Phường Phúc Tân" }, { code: "00040", name: "Phường Đồng Xuân" }, { code: "00043", name: "Phường Hàng Mã" }] },
            { code: "003", name: "Quận Tây Hồ", wards: [{ code: "00109", name: "Phường Phú Thượng" }, { code: "00112", name: "Phường Xuân La" }] },
            { code: "004", name: "Quận Long Biên", wards: [{ code: "00118", name: "Phường Thượng Thanh" }, { code: "00121", name: "Phường Ngọc Thụy" }] },
            { code: "005", name: "Quận Cầu Giấy", wards: [{ code: "00157", name: "Phường Nghĩa Đô" }, { code: "00160", name: "Phường Nghĩa Tân" }] },
            { code: "006", name: "Quận Đống Đa", wards: [{ code: "00193", name: "Phường Cát Linh" }, { code: "00196", name: "Phường Văn Miếu" }] },
            { code: "007", name: "Quận Hai Bà Trưng", wards: [{ code: "00229", name: "Phường Nguyễn Du" }, { code: "00232", name: "Phường Bạch Đằng" }] },
            { code: "008", name: "Quận Hoàng Mai", wards: [{ code: "00268", name: "Phường Hoàng Liệt" }, { code: "00271", name: "Phường Yên Sở" }] },
            { code: "009", name: "Quận Thanh Xuân", wards: [{ code: "00307", name: "Phường Nhân Chính" }, { code: "00310", name: "Phường Thanh Xuân Bắc" }] },
            // ... more districts
        ]
    },
    {
        code: "79", name: "Hồ Chí Minh",
        districts: [
            { code: "760", name: "Quận 1", wards: [{ code: "26734", name: "Phường Tân Định" }, { code: "26737", name: "Phường Đa Kao" }] },
            { code: "761", name: "Quận 12", wards: [{ code: "26788", name: "Phường Thạnh Xuân" }, { code: "26791", name: "Phường Thạnh Lộc" }] },
            { code: "770", name: "Quận Gò Vấp", wards: [{ code: "27133", name: "Phường 1" }, { code: "27136", name: "Phường 3" }] },
            { code: "769", name: "Thành phố Thủ Đức", wards: [{ code: "26896", name: "Phường Linh Xuân" }, { code: "26899", name: "Phường Linh Trung" }] },
             // ... more districts
        ]
    },
    {
        code: "48", name: "Đà Nẵng",
        districts: [
            { code: "490", name: "Quận Liên Chiểu", wards: [{ code: "20188", name: "Phường Hòa Hiệp Bắc" }, { code: "20191", name: "Phường Hòa Hiệp Nam" }] },
            { code: "491", name: "Quận Thanh Khê", wards: [{ code: "20209", name: "Phường Tam Thuận" }, { code: "20212", name: "Phường Thanh Khê Tây" }] },
            { code: "492", name: "Quận Hải Châu", wards: [{ code: "20227", name: "Phường Thanh Bình" }, { code: "20230", name: "Phường Thuận Phước" }] },
        ]
    },
     {
        code: "31", name: "Hải Phòng",
        districts: [
            { code: "303", name: "Quận Hồng Bàng", wards: [] },
            { code: "304", name: "Quận Ngô Quyền", wards: [] },
        ]
    },
     {
        code: "92", name: "Cần Thơ",
        districts: [
            { code: "916", name: "Quận Ninh Kiều", wards: [] },
            { code: "917", name: "Quận Ô Môn", wards: [] },
        ]
    }
];
