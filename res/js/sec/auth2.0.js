
let userID;

let autosaveFile, autosaveTitle = null;

//THE USER'S SAVE SLOT. RESOLVED ONCE AT BOOT, NEVER CHANGES AFTER THAT.
let fileID = null;

//TRUE WHILE THE RESTORE BANNER IS UP AND UNANSWERED. WHILE IT IS TRUE THERE IS A
//SAVED FILE ON THE SERVER THAT THE USER HAS NOT CLAIMED YET, AND AN AUTOSAVE TICK
//WOULD OVERWRITE THE EXACT FILE THE BANNER IS OFFERING TO RESTORE.
let restorePending = false;

let aiCredits = 0;

let tmrStamp = null;
let tempH = 0;
let saveModal = false;

//TRUE ONCE THE LAPSE MODAL IS UP. IT IS A ONE-WAY LATCH: THERE IS NO PATH BACK TO
//A WORKING STUDIO FROM HERE, SO EVERY OTHER CHECK STANDS DOWN INSTEAD OF STACKING
//A SECOND MODAL ON TOP OF IT.
let lapsedModal = false;

//ARMED AT BOOT TO access_exp, TO THE SECOND. A TAB OPENED AT 11pm WITH A 3am EXPIRY
//CARRIES A FOUR-HOUR TIMER AND FIRES AT 3am WHETHER OR NOT ANYBODY TOUCHED IT.
let tmrLapse = null;
let saveMoves = 0;
let saving = false;

const supabaseUrl = 'https://mdskbqpghlptskglsekp.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kc2ticXBnaGxwdHNrZ2xzZWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNjg5MzQsImV4cCI6MjA1MzY0NDkzNH0.73MEv89D96Uzm0Ft65lRPhY0gQghia8jvVdwK1G5UkU";
const wondrSupabase = supabase.createClient(supabaseUrl, supabaseKey);

//////////////////CACHE API FOR AUTOSAVING WORK////////////////

function leavePage(url) {

    blurWrapper.style.opacity = "0";

    setTimeout(() => {
        window.location.replace(url);
    }, 200)
}

//[1] VALIDATE FIRST USER'S SESSION
async function validateSessionUser() {
    // Get current session first
    const { data: { session } } = await wondrSupabase.auth.getSession();
    
    if (session == null) {
        window.location.replace(window.location.origin);
        return;
    }

    await validateAccess(session);

    //FROM HERE ONLY WATCH FOR LOSING THE SESSION
    wondrSupabase.auth.onAuthStateChange((event, session) => {

        if (session == null) {

            userID = null;
            clearInterval(tmrStamp);
            tmrStamp = null;

            //THE STUDIO IS ON SCREEN WHEN A SESSION DIES MID-USE, SO THIS ONE FADES.
            leavePage(window.location.origin);

        }
    });
}

validateSessionUser();

//[2] EDGE FUNCTION VERIFIES THE TOKEN AND READS THE WHITELIST IN ONE CALL
async function validateAccess(session) {

    const { data, error } = await wondrSupabase.functions.invoke('supabase-validate-access', {
        headers: { Authorization: `Bearer ${session.access_token}` }
    })

    //ONLY THE SERVER CAN SAY SUBSCRIBER
    if(!error && data.access == "subscriber") {

        userID = session.user.id;

        await fetchAutoSave();

        //DAILY CREDIT RESET IF THE UTC DAY MOVED, RETURNS THE CURRENT BALANCE
        const { data: credits } = await wondrSupabase
        .schema('wondr_users')
        .rpc('refresh_ai_credits');

        aiCredits = credits;
        document.getElementById('lblAiCredits').innerText = aiCredits;
        let local = session.user.email.split('@')[0];
        let domain = session.user.email.slice(session.user.email.indexOf('@'));

        document.getElementById('lblUserEmail').innerText = local[0] + '••••' + local.slice(-1) + domain;
        //FROM THE WHITELIST ROW, NOT FROM auth.users. THE OAUTH STAMP IS THE DAY
        //THEY FIRST SIGNED IN, WHICH CAN BE A YEAR BEFORE THEY EVER PAID - THE
        //PANEL WOULD THEN GREET A BRAND NEW SUBSCRIBER WITH A MEMBERSHIP THAT
        //LOOKS ALREADY SPENT. THE WHITELIST ROW IS BORN AT THE GRANT, SO ITS
        //created_at IS THE REAL JOIN DATE. null RENDERS AS "None".
        document.getElementById('lblMemberSince').innerText = dateWondr(data.member_since);
        document.getElementById('lblExpiration').innerText = dateWondr(data.access_exp);

        let lblAccessBadge = document.getElementById('lblAccessBadge');

        //THE ONLY QUESTION THIS ROW ASKS IS WHETHER THE ACCOUNT EARNED THE FOUNDING
        //BADGE. EVERY OTHER SUBSCRIBER - MONTHLY, LIFETIME, HAND-WHITELISTED - GETS
        //THE PLAIN LABEL. days_left IS NOT PART OF THIS DECISION: A MONTHLY MEMBER
        //HAS A days_left AND NO BADGE, WHICH USED TO ENTER A BRANCH THAT WROTE
        //NOTHING AND LEFT THE ROW AS AN EMPTY RECTANGLE.
        if(data.access_badge == "founding member") {

            let badge = 
            `<svg width="1835" height="1922" viewBox="0 0 1835 1922" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M59.5896 638.802C89.1618 657.474 130.132 683.344 141.06 723.276C149.611 695.237 160.418 667.771 173.888 641.408C166.504 660.618 157.195 692.38 149.237 733.625C169.031 704.428 203.15 678.273 258.138 677.885L257.831 679.055C244.94 728.062 224.85 804.437 139.675 794.276C137.025 815.603 134.906 838.461 133.586 862.598C151.343 831.038 183.208 801.962 237.425 793.081L237.29 794.402C231.7 849.056 223.03 933.829 132.305 939.371C132.755 960.37 133.878 982.015 135.808 1004.18C150.855 971.889 179.458 941.194 230.422 926.099L230.454 927.473C231.773 983.138 233.804 1068.86 146.95 1088.69C150.526 1108.8 154.83 1129.19 159.949 1149.76C169.179 1112.5 193.1 1074.11 243.987 1047.72L244.301 1049.17C257.131 1108.16 276.954 1199.31 186.544 1237.28C195.695 1262.59 206.212 1288.02 218.248 1313.41C216.004 1272.74 228.563 1226.03 273.926 1184.44L274.621 1185.79C303.841 1242.23 349.426 1330.29 260.856 1392.32C273.648 1413.29 287.604 1434.14 302.812 1454.78C295.321 1411.36 302.881 1359.77 345.412 1309.01L346.363 1310.37C385.435 1366.39 445.9 1453.07 366.755 1531.99C374.274 1540.11 382.019 1548.17 389.994 1556.17L391.215 1557.4C391.652 1557.84 392.108 1558.3 392.582 1558.78L392.594 1558.79L392.597 1558.8L392.604 1558.8C400.039 1566.3 412.025 1578.38 428.461 1593.26C407.579 1548.85 400.557 1490.03 436.91 1423.65L438.154 1424.85C490.138 1474.79 571.075 1552.54 500.324 1651.25C522.946 1667.5 548.782 1684.34 577.765 1700.61C550.952 1661.38 535.243 1606.74 557.522 1537.74L558.961 1538.68C618.046 1577.11 709.467 1636.56 664.496 1742.68C690.979 1753.61 719.267 1763.6 749.33 1772.15C712.77 1737.78 684.208 1685.15 690.772 1609.13L692.49 1609.76C758.785 1633.99 859.172 1670.69 853.341 1775.39L832.269 1796.46C824.459 1804.27 824.459 1816.93 832.269 1824.74L844.214 1836.69C807.925 1886.69 722.179 1953.47 602.842 1904.12L603.958 1902.67C632.925 1865.06 671.909 1814.46 724.165 1796.63C702.006 1789.66 679.363 1781.53 656.452 1772.13C615.987 1811.33 518.995 1862.91 415.045 1788.96L416.371 1787.87C449.976 1760.24 494.935 1723.27 545.04 1716.63C524.804 1704.64 504.624 1691.54 484.642 1677.28C434.926 1707.08 334.15 1733.81 248.9 1644.79L250.414 1643.96C288.342 1623.27 338.933 1595.66 389.058 1597.8C375.212 1584.45 361.594 1570.41 348.261 1555.65C297.418 1575.94 192.234 1586.4 126.129 1482.66L127.716 1482.17C170.675 1468.73 229.137 1450.45 278.725 1467.96C265.635 1449.11 252.991 1429.36 240.865 1408.69C190.948 1419.06 100.74 1412.19 55.4334 1314.94L56.9246 1314.68C97.2619 1307.69 152.15 1298.17 194.786 1319.84C184.709 1297.75 175.182 1274.77 166.267 1250.87C118.837 1251.68 24.2025 1225.96 4.90213 1115.15L6.37186 1115.28C47.7769 1119.09 104.725 1124.34 139.096 1159.13C134.867 1140.44 130.574 1118.95 126.719 1095.3C126.492 1096.35 126.254 1097.4 126.006 1098.46C83.2134 1091.94 -1.88998 1052.24 0.0320125 945.591L1.35135 945.974C39.2409 956.963 91.6283 972.159 116.366 1011.66C114.556 990.139 113.345 967.733 112.973 944.758C71.957 931.642 -0.310434 883.139 14.0457 783.872L15.2654 784.399C49.2404 799.081 95.8288 819.214 115.876 857.751C117.639 837.307 120.233 816.729 123.806 796.212C88.6722 778.097 31.9548 724.516 58.5672 638.156L59.5896 638.802Z" fill="white"/>
                    <path d="M1776.28 638.156C1802.89 724.516 1746.17 778.097 1711.04 796.212C1714.61 816.729 1717.2 837.307 1718.97 857.751C1739.02 819.214 1785.6 799.081 1819.58 784.399L1820.8 783.872C1835.15 883.138 1762.89 931.641 1721.87 944.757C1721.5 967.732 1720.29 990.139 1718.48 1011.66C1743.21 972.158 1795.6 956.963 1833.49 945.974L1834.81 945.591C1836.73 1052.24 1751.63 1091.94 1708.84 1098.46C1708.59 1097.4 1708.35 1096.35 1708.12 1095.3C1704.27 1118.95 1699.98 1140.44 1695.75 1159.13C1730.12 1124.34 1787.07 1119.09 1828.47 1115.28L1829.94 1115.14C1810.64 1225.96 1716.01 1251.68 1668.58 1250.87C1659.66 1274.77 1650.14 1297.75 1640.06 1319.84C1682.69 1298.17 1737.58 1307.69 1777.92 1314.68L1779.41 1314.94C1734.1 1412.19 1643.9 1419.06 1593.98 1408.69C1581.85 1429.36 1569.21 1449.11 1556.12 1467.96C1605.71 1450.45 1664.17 1468.73 1707.13 1482.17L1708.72 1482.66C1642.61 1586.4 1537.43 1575.94 1486.58 1555.65C1473.25 1570.41 1459.63 1584.45 1445.79 1597.8C1495.91 1595.66 1546.5 1623.27 1584.43 1643.96L1585.94 1644.79C1500.69 1733.81 1399.92 1707.08 1350.2 1677.28C1330.22 1691.54 1310.04 1704.64 1289.8 1716.63C1339.91 1723.27 1384.87 1760.24 1418.47 1787.87L1419.8 1788.96C1315.85 1862.91 1218.86 1811.33 1178.39 1772.13C1155.48 1781.53 1132.84 1789.66 1110.68 1796.63C1162.94 1814.46 1201.92 1865.06 1230.89 1902.66L1232 1904.11C1112.39 1953.58 1026.52 1886.38 990.379 1836.34L1001.98 1824.74C1009.79 1816.93 1009.79 1804.27 1001.98 1796.46L981.541 1776.02C975.267 1670.83 1075.93 1634.04 1142.35 1609.76L1144.07 1609.13C1150.64 1685.15 1122.07 1737.78 1085.51 1772.15C1115.58 1763.6 1143.87 1753.61 1170.35 1742.68C1125.38 1636.56 1216.8 1577.11 1275.88 1538.68L1277.32 1537.74C1299.6 1606.74 1283.89 1661.38 1257.08 1700.61C1286.06 1684.34 1311.9 1667.5 1334.52 1651.25C1263.77 1552.54 1344.71 1474.79 1396.69 1424.85L1397.93 1423.65C1434.29 1490.03 1427.27 1548.85 1406.38 1593.26C1422.83 1578.37 1434.83 1566.28 1442.26 1558.78L1442.26 1558.78L1442.39 1558.65C1443.28 1557.76 1444.1 1556.93 1444.85 1556.17C1452.83 1548.17 1460.57 1540.11 1468.09 1531.99C1388.94 1453.07 1449.41 1366.39 1488.48 1310.37L1489.43 1309.01C1531.96 1359.77 1539.52 1411.36 1532.03 1454.78C1547.24 1434.14 1561.2 1413.29 1573.99 1392.32C1485.42 1330.29 1531 1242.23 1560.22 1185.79L1560.92 1184.44C1606.28 1226.03 1618.84 1272.74 1616.6 1313.41C1628.63 1288.02 1639.15 1262.59 1648.3 1237.28C1557.89 1199.31 1577.71 1108.16 1590.54 1049.17L1590.86 1047.72C1641.74 1074.11 1665.67 1112.5 1674.9 1149.76C1680.01 1129.19 1684.32 1108.8 1687.89 1088.69C1601.04 1068.86 1603.07 983.138 1604.39 927.473L1604.42 926.099C1655.39 941.194 1683.99 971.888 1699.04 1004.18C1700.97 982.014 1702.09 960.37 1702.54 939.371C1611.81 933.829 1603.14 849.056 1597.55 794.402L1597.42 793.08C1651.64 801.961 1683.5 831.037 1701.26 862.597C1699.94 838.46 1697.82 815.603 1695.17 794.276C1609.99 804.436 1589.9 728.062 1577.01 679.055L1576.7 677.885C1631.69 678.273 1665.81 704.428 1685.61 733.625C1677.65 692.38 1668.34 660.618 1660.96 641.408C1674.43 667.771 1685.23 695.237 1693.78 723.276C1704.71 683.344 1745.68 657.474 1775.25 638.802L1776.28 638.156Z" fill="white"/>
                    <path d="M909.767 1747.68C913.673 1743.77 920.004 1743.77 923.909 1747.68L980.477 1804.25C984.383 1808.15 984.383 1814.48 980.477 1818.39L923.909 1874.96C920.004 1878.86 913.672 1878.86 909.767 1874.96L853.199 1818.39C849.294 1814.48 849.294 1808.15 853.199 1804.25L909.767 1747.68Z" fill="white"/>
                    <path d="M1158.83 759.506H866.328V905.307H1079.13V1037.61H866.328V1298.61H709.727V623.606H1158.83V759.506Z" fill="white"/>
                    <path d="M208.844 448.725C210.787 445.496 215.469 445.496 217.412 448.725L244.951 494.486C245.649 495.646 246.788 496.474 248.107 496.779L300.139 508.83C303.811 509.681 305.257 514.132 302.787 516.978L267.775 557.311C266.888 558.334 266.453 559.673 266.57 561.021L271.187 614.23C271.513 617.985 267.726 620.737 264.256 619.266L215.078 598.432C213.831 597.904 212.424 597.905 211.178 598.432L161.999 619.266C158.529 620.737 154.741 617.985 155.067 614.23L159.685 561.021C159.802 559.673 159.367 558.334 158.479 557.311L123.469 516.978C120.998 514.132 122.444 509.68 126.116 508.83L178.148 496.779C179.467 496.474 180.605 495.646 181.303 494.486L208.844 448.725Z" fill="white"/>
                    <path d="M1620.84 448.725C1622.79 445.496 1627.47 445.496 1629.41 448.725L1656.95 494.486C1657.65 495.646 1658.79 496.474 1660.11 496.779L1712.14 508.83C1715.81 509.681 1717.26 514.132 1714.79 516.978L1679.78 557.311C1678.89 558.334 1678.45 559.673 1678.57 561.021L1683.19 614.23C1683.51 617.985 1679.73 620.737 1676.26 619.266L1627.08 598.432C1625.83 597.904 1624.42 597.904 1623.18 598.432L1574 619.266C1570.53 620.736 1566.74 617.985 1567.07 614.23L1571.69 561.021C1571.8 559.673 1571.37 558.334 1570.48 557.311L1535.47 516.978C1533 514.132 1534.44 509.68 1538.12 508.83L1590.15 496.779C1591.47 496.474 1592.61 495.646 1593.3 494.486L1620.84 448.725Z" fill="white"/>
                    <path d="M401.844 248.725C403.787 245.496 408.468 245.496 410.411 248.725L437.951 294.486C438.649 295.646 439.788 296.474 441.107 296.779L493.138 308.83C496.81 309.68 498.257 314.132 495.787 316.978L460.775 357.311C459.888 358.334 459.452 359.673 459.569 361.021L464.187 414.23C464.513 417.985 460.726 420.737 457.256 419.267L408.078 398.433C406.831 397.904 405.423 397.904 404.177 398.433L354.999 419.267C351.529 420.737 347.741 417.985 348.067 414.23L352.685 361.021C352.802 359.673 352.367 358.334 351.479 357.311L316.468 316.978C313.997 314.132 315.445 309.68 319.116 308.83L371.147 296.779C372.466 296.474 373.605 295.646 374.303 294.486L401.844 248.725Z" fill="white"/>
                    <path d="M1420.84 248.725C1422.79 245.496 1427.47 245.496 1429.41 248.725L1456.95 294.486C1457.65 295.646 1458.79 296.474 1460.11 296.779L1512.14 308.83C1515.81 309.68 1517.26 314.132 1514.79 316.978L1479.78 357.311C1478.89 358.334 1478.45 359.673 1478.57 361.021L1483.19 414.23C1483.51 417.985 1479.73 420.737 1476.26 419.267L1427.08 398.433C1425.83 397.904 1424.42 397.904 1423.18 398.433L1374 419.267C1370.53 420.737 1366.74 417.985 1367.07 414.23L1371.69 361.021C1371.8 359.673 1371.37 358.334 1370.48 357.311L1335.47 316.978C1333 314.132 1334.44 309.68 1338.12 308.83L1390.15 296.779C1391.47 296.474 1392.61 295.646 1393.3 294.486L1420.84 248.725Z" fill="white"/>
                    <path d="M624.844 117.725C626.787 114.496 631.469 114.496 633.412 117.725L660.951 163.486C661.649 164.646 662.788 165.474 664.107 165.779L716.139 177.83C719.811 178.681 721.257 183.132 718.787 185.978L683.775 226.311C682.888 227.334 682.453 228.673 682.57 230.021L687.187 283.23C687.513 286.985 683.726 289.737 680.256 288.267L631.078 267.433C629.831 266.904 628.424 266.905 627.177 267.433L577.999 288.267C574.529 289.737 570.741 286.985 571.067 283.23L575.685 230.021C575.802 228.673 575.367 227.334 574.479 226.311L539.469 185.978C536.998 183.132 538.444 178.68 542.116 177.83L594.148 165.779C595.467 165.474 596.605 164.646 597.303 163.486L624.844 117.725Z" fill="white"/>
                    <path d="M1203.84 117.725C1205.79 114.496 1210.47 114.496 1212.41 117.725L1239.95 163.486C1240.65 164.646 1241.79 165.474 1243.11 165.779L1295.14 177.83C1298.81 178.68 1300.26 183.132 1297.79 185.978L1262.78 226.311C1261.89 227.334 1261.45 228.673 1261.57 230.021L1266.19 283.23C1266.51 286.985 1262.73 289.737 1259.26 288.267L1210.08 267.433C1208.83 266.904 1207.42 266.904 1206.18 267.433L1157 288.267C1153.53 289.737 1149.74 286.985 1150.07 283.23L1154.69 230.021C1154.8 228.673 1154.37 227.334 1153.48 226.311L1118.47 185.978C1116 183.132 1117.44 178.68 1121.12 177.83L1173.15 165.779C1174.47 165.474 1175.61 164.646 1176.3 163.486L1203.84 117.725Z" fill="white"/>
                    <path d="M908.559 4.84365C912.446 -1.61455 921.808 -1.61455 925.695 4.84365L964.317 69.0185C965.713 71.3386 967.991 72.9934 970.629 73.6044L1043.6 90.5048C1050.94 92.2054 1053.83 101.11 1048.89 106.802L999.793 163.364C998.018 165.409 997.148 168.086 997.383 170.784L1003.86 245.404C1004.51 252.913 996.935 258.417 989.995 255.476L921.028 226.259C918.535 225.202 915.72 225.202 913.226 226.259L844.26 255.476C837.319 258.417 829.745 252.913 830.396 245.404L836.872 170.784C837.106 168.086 836.237 165.409 834.462 163.364L785.361 106.802C780.42 101.11 783.314 92.2054 790.657 90.5048L863.626 73.6044C866.264 72.9934 868.542 71.3386 869.938 69.0185L908.559 4.84365Z" fill="white"/>
                </svg>
                <h1>Founding Member</h1>`

            lblAccessBadge.innerHTML = badge;

            //THE BADGE ROW REPLACES BOTH NORMAL ROWS. display IS CLEARED RATHER THAN
            //SET TO A VALUE, SO THE STYLESHEET STILL DECIDES HOW .pnlEntry LAYS ITSELF
            //OUT - THIS LINE ONLY REMOVES THE INLINE display:none THE MARKUP SHIPS WITH.
            //TARGETED BY ID, NOT BY POSITION, SO REORDERING THE PANEL IS SAFE.
            document.getElementById('pnlAccessBadge').style.visibility = "visible";
            document.getElementById('pnlAccess').style.display = "none";
            document.getElementById('pnlExpiration').style.visibility = "hidden";
        }
        else {

            //A REGULAR SUBSCRIBER NEVER TOUCHES #lblAccessBadge. ITS ROW STAYS HIDDEN
            //AND THE VALUE GOES INTO A PLAIN .pnlValue, SO IT READS LIKE EVERY OTHER
            //ROW IN THE PANEL INSTEAD OF WEARING THE FOUNDING CHROME.
            document.getElementById('lblAccess').innerText = "Subscriber";
            document.getElementById('pnlAccessBadge').style.display = "none";
            document.getElementById('pnlAccess').style.display = "flex";
            document.getElementById('pnlExpiration').style.visibility = "visible";
        }

        //FADE IN FROM THE BG, ALSO COVERS A REFRESH
        blurWrapper.style.opacity = "1";

        if(typeof fetchStylishLength === 'function') fetchStylishLength();
        if(typeof fetchSerifLength === 'function') fetchSerifLength();
        if(typeof fetchSansSerifLength === 'function') fetchSansSerifLength();

        //AUTOSAVE AND THE LAPSE WATCH FIRST. THE 3D WARM UP DOWNLOADS 7 FILES ON AN EMPTY CACHE AND MUST NEVER HOLD THEM BACK
        tempH = h;

        if(tmrStamp == null) {
            tmrStamp = setInterval(autoSave, 1000);
        }

        armLapseWatch(data.access_exp);

        //DEFAULT ENV FIRST SO 2D TO 3D IS READY, THEN WARM THE REST IN THE BACKGROUND
        if(typeof create3DEnvironment === 'function') await create3DEnvironment();

        if(typeof countAllEnvironments === 'function') countAllEnvironments();
    }

    //BLOCKED IS ALREADY SIGNED OUT ON THE SERVER, CLEAR WHAT IS LEFT HERE. A BAN IS
    //THE ONE CASE THAT STILL ENDS THE SESSION - THERE IS NOTHING FOR THEM TO BUY.
    else if(!error && data != null && data.access == "blocked") {

        await wondrSupabase.auth.signOut();

        localStorage.clear();
        sessionStorage.clear();

        window.location.replace(window.location.origin);

    }

    //EVERYBODY ELSE - LAPSED, NEVER WHITELISTED, OR A FAILED CHECK - GOES TO BILLING
    //WITH THE SESSION INTACT. THEY ARE ALREADY SIGNED IN WITH GOOGLE; SIGNING THEM
    //OUT WOULD FORCE AN OAUTH ROUND TRIP BEFORE THEY COULD PAY, AND billing.html
    //NEEDS THE SESSION TO KNOW WHO THEY ARE AND WHICH PRICE TO SHOW.
    //
    //NO MODAL ON THIS PATH. THEY NEVER SAW THE STUDIO, SO A POPUP ABOUT THE STUDIO
    //IS NOISE - billing.html CARRIES THE MESSAGE ITSELF FROM access_exp.
    else {

        window.location.replace(`${window.location.origin}/billing.html`);

    }

}

//////////////////////////THE LAPSE WATCH/////////////////////////////////////////
function armLapseWatch(access_exp) {

    //REGISTERED ONCE, NOT ON EVERY RE-ARM. THE >24-DAY BRANCH BELOW CALLS THIS
    //FUNCTION AGAIN, AND A SECOND LISTENER WOULD MEAN TWO EDGE CALLS ON EVERY
    //WAKE-UP FOR THE REST OF THE SESSION.
    if(tmrLapse == null) document.addEventListener('visibilitychange', wakeLapseCheck);

    if(access_exp == null) return;

    if(tmrLapse != null) clearTimeout(tmrLapse);

    //setTimeout IS CAPPED AT ~24.8 DAYS. A LONGER RUNWAY IS RE-ARMED A DAY AT A TIME
    //RATHER THAN SILENTLY FIRING IMMEDIATELY, WHICH IS WHAT AN OVERFLOWED DELAY DOES.
    let wait = new Date(access_exp) - new Date();

    if(wait <= 0) {
        wakeLapseCheck();
        return;
    }

    if(wait > 86400000) {
        tmrLapse = setTimeout(() => armLapseWatch(access_exp), 86400000);
        return;
    }

    //ONE SECOND OF SLACK SO THE SERVER HAS DEFINITELY CROSSED THE BOUNDARY TOO -
    //FIRING ON THE EXACT MILLISECOND WOULD RACE now() AND ASK ONE TICK TOO EARLY.
    tmrLapse = setTimeout(wakeLapseCheck, wait + 1000);
}

//THE LAPTOP-CLOSED-OVERNIGHT CASE. A SLEEPING MACHINE DOES NOT RUN TIMERS, SO THE
//TIMER ABOVE FIRES LATE OR NOT AT ALL - COMING BACK TO THE TAB IS THE OTHER SIGNAL.
async function wakeLapseCheck() {

    if(lapsedModal) return;
    if(document.visibilityState != "visible") return;

    if(await stillSubscriber()) return;

    subscriberDowngrade();
}

//THE SERVER IS ASKED, NEVER THE BROWSER'S OWN STATE. ONE EDGE CALL, AND ONLY ON A
//SIGNAL - A WAKE-UP, THE EXPIRY MOMENT, OR A SAVE THAT FAILED.
async function stillSubscriber() {

    try {

        const { data: { session } } = await wondrSupabase.auth.getSession();

        //NO SESSION IS NOT A LAPSE. onAuthStateChange ALREADY HANDLES THAT, AND
        //TREATING IT AS ONE WOULD PAINT THE WRONG MODAL ON THE WAY OUT.
        if(session == null) return true;

        const { data, error } = await wondrSupabase.functions.invoke('supabase-validate-access', {
            headers: { Authorization: `Bearer ${session.access_token}` }
        });

        //A FAILED CHECK IS NOT A LAPSE EITHER. FAILING OPEN HERE IS SAFE BECAUSE THE
        //DATABASE IS STILL REFUSING EVERY WRITE - THE WORST CASE IS THAT THE MEMBER
        //IS TOLD A MOMENT LATER, NOT THAT THEY GET FREE ACCESS.
        if(error || data == null) return true;

        return data.access == "subscriber";
    }
    catch { return true; }
}

//////////////////////////THE LAPSE MODAL/////////////////////////////////////////
//TWO ACTIONS, NEITHER OF THEM A DISMISS. NO CLOSE BUTTON, NO BACKDROP CLICK (THE
//lock FLAG BELOW IS WHAT delegation.js CHECKS), AND Esc IS ALREADY UNBOUND WHILE A
//MODAL IS OPEN. THERE IS NO WORKING STUDIO BEHIND IT TO GO BACK TO.
//
//NO PRICE IN HERE. PRICING HAS A DEDICATED PAGE WITH THE FULL CONTEXT - A NUMBER IN
//A SMALL POPUP IS THE THING sir RULED OUT ON THE SIGN-UP MODAL.
//
//THE SECOND LINE IS DOING REAL WORK. THE FIRST THOUGHT OF SOMEBODY WHOSE SAVE JUST
//STOPPED IS "DID I LOSE EVERYTHING?" - ANSWER IT BEFORE THEY HAVE TO ASK.
function subscriberDowngrade() {

    if(lapsedModal) return;

    lapsedModal = true;

    //STOP THE TICK. EVERY SAVE FROM HERE IS A GUARANTEED 403, AND A FAILING TIMER
    //UNDER A MODAL IS NOISE IN THE CONSOLE AND WASTED REQUESTS.
    clearInterval(tmrStamp);
    tmrStamp = null;

    if(tmrLapse != null) clearTimeout(tmrLapse);

    hideLoading();

    //button1 IS #btnModalClose AND CSS PAINTS IT --sharp (WHITE); button2 IS
    //#btnModalOkay AND STAYS --accent (BLUE). THE NAMES ARE INVERTED AGAINST THEIR
    //LOOK, SO READ THE CSS, NOT THE IDS: WHITE = Download, BLUE = Subscribe.
    showModal(
        "Your subscription has ended",
        "Please renew your subscription to resume working or download your last autosave file.",
        "Download",
        "Subscribe",
        25
    );

    //delegation.js WILL NOT DISMISS AN OVERLAY CARRYING THIS FLAG. SET AFTER
    //showModal, WHICH REPLACES THE CARD BUT NEVER TOUCHES THE OVERLAY'S DATASET.
    document.getElementById('modalOverlay').dataset.lock = "1";

    document.getElementById('btnModalOkay').addEventListener('click', e => {

        hideModal();
        leavePage(`${window.location.origin}/billing.html`);
    })

    document.getElementById('btnModalClose').addEventListener('click', downloadRecoveredFreeAutosave)
}

//////////////////////////THE RESCUE DOWNLOAD/////////////////////////////////////
//THE STORED OBJECT CANNOT BE REACHED FROM HERE ANY MORE - THE STORAGE POLICY DENIES
//A LAPSED MEMBER, WHICH IS THE WHOLE POINT - SO THE SERVER FETCHES IT WITH SERVICE
//ROLE, RUNS THE SAME ENCRYPT PIPELINE AS wondr-file-encrypt AND HANDS BACK A .wdr.
//
//THE FILE IS ENCRYPTED AND THAT IS DELIBERATE: IT ONLY OPENS INSIDE WONDR, IN AN
//ACCOUNT THAT CAN OPEN IT. HANDING IT OVER GIVES AWAY NO PRODUCT, AND "THEY LET ME
//KEEP MY WORK" IS THE OPPOSITE OF THE SUPPORT THREAD THIS EXISTS TO PREVENT.
//
//THE EDGE FUNCTION IS CALLED AT MOST ONCE PER LAPSE. THE MODAL STAYS OPEN AFTER A
//DOWNLOAD, SO A SECOND CLICK IS EXPECTED AND EVERY CALL COSTS US - THE FIRST ANSWER
//GOES INTO THE recovered_autosave CACHE AND EVERY CLICK AFTER IT IS A LOCAL BLOB.
async function downloadRecoveredFreeAutosave() {

    let btn = document.getElementById('btnModalClose');
    let label = btn.querySelector('h2');

    //FREEZE THE WIDTH BEFORE THE CAPTION LEAVES. THE RING IS NARROWER THAN THE WORD,
    //SO WITHOUT THIS THE BUTTON COLLAPSES, Subscribe SLIDES ACROSS, AND BOTH SNAP
    //BACK WHEN IT FINISHES. .btnModal IS border-box, SO offsetWidth IS THE EXACT
    //NUMBER TO PIN - WITHOUT border-box THE 0.5em PADDING WOULD BE ADDED A SECOND
    //TIME AND THE BUTTON WOULD GROW BY A FULL em INSTEAD.
    btn.style.width = btn.offsetWidth + 'px';

    //SPINNER IN, CAPTION OUT. THE CAPTION IS HIDDEN RATHER THAN OVERWRITTEN SO THE
    //SUCCESS PATH HAS NO STRING TO PUT BACK, AND THE RING IS A SIBLING OF THE h2
    //RATHER THAN A CHILD: THAT h2 IS 12px AND overflow:hidden, WHICH WOULD CLIP A
    //14px CIRCLE. .btnModal IS display:flex, SO margin:auto CENTRES IT.
    label.style.display = "none";
    btn.insertAdjacentHTML('beforeend', '<span id="iconSpinModal"></span>');

    //THE MODAL STAYS UP. THEY MAY STILL WANT TO SUBSCRIBE AFTERWARDS, AND THERE IS
    //NOTHING BEHIND IT TO RETURN TO ANYWAY.
    btn.style.pointerEvents = "none";

    let file = null;
    let title = null;

    //THE LOCAL COPY FIRST, AND ONLY IF IT IS THIS ACCOUNT'S AND FROM TODAY. A MATCH
    //MEANS THIS IS A REPEAT CLICK AND THE EDGE FUNCTION IS NEVER TOUCHED. NOTHING
    //FOUND IS A FIRST CLICK, A STALE DAY, ANOTHER ACCOUNT, OR AN EVICTION - A BROWSER
    //UNDER STORAGE PRESSURE CLEARS AN ORIGIN AS A WHOLE - AND EVERY ONE OF THOSE
    //FALLS THROUGH TO THE SERVER. THAT IS WHY THIS IS AN OPTIMISATION AND NEVER A
    //DEPENDENCY, AND WHY THE WHOLE READ SITS IN A try: A THROW HERE HAS TO COST ONE
    //EDGE CALL, NEVER THE FILE.
    try {

        //CACHE IS THE LOCAL FOLDER PATH
        let cache = await caches.open('recovered_autosave');

        //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
        let keys = await cache.keys();

        let today = dateStampWondr();

        for(let a = 0; a < keys.length; a++) {

            //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME.
            //[0] IS THE EMPTY STRING BEFORE THE LEADING SLASH, [1] IS THE uid,
            //[2] IS THE YYYYMMDD STAMP AND [3] IS THE TITLE.
            let key = new URL(keys[a].url).pathname.split('/');

            //ANOTHER ACCOUNT ON THIS BROWSER IS NOT OURS TO OPEN, AND A COPY FROM AN
            //EARLIER DAY IS NOT WHAT THE SERVER HOLDS ANY MORE - THEY COULD HAVE
            //RESUBSCRIBED, WORKED AND LAPSED AGAIN SINCE IT WAS WRITTEN.
            if(key[1] != userID) continue;
            if(key[2] != today) continue;

            let data = await cache.match(keys[a]);

            if(data == null) continue;

            file = await data.text();
            title = decodeURIComponent(key[3]);
            break;
        }
    }
    catch { }

    if(file == null || file == "") {

        const { data, error } = await wondrSupabase.functions.invoke('wondr-downgrade-to-free-autosave-encrypt-download');

        if(error || data == null || data.file == null) {

            //functions.invoke PUTS ANY NON-2xx INTO error AND LEAVES THE BODY UNREAD, SO
            //error.message IS ALWAYS THE USELESS "non-2xx status code". THE REAL CODE IS
            //ON error.context, WHICH IS THE RAW Response.
            let code = null;

            try { code = (await error.context.json()).code; } catch {}

            //NOT_FOUND IS NOT A FAILURE AND IT IS NOT RETRYABLE. THE wondr_files ROW IS
            //CREATED AT BOOT, BEFORE THE FIRST UPLOAD, SO A ROW WITH NO OBJECT IS THE
            //NORMAL STATE OF AN ACCOUNT THAT SIGNED IN AND NEVER DREW ANYTHING. THERE
            //IS NOTHING TO FETCH AND NOTHING WILL APPEAR LATER, SO THE BUTTON IS RETIRED
            //RATHER THAN HANDED BACK - A LIVE BUTTON INVITES CLICKS THAT CAN ONLY EVER
            //FAIL THE SAME WAY, AND EACH ONE COSTS AN EDGE CALL.
            if(code == "NOT_FOUND") {

                retireModalButton(btn, label, "No autosave file found");
                return;
            }

            //EVERYTHING ELSE IS "Try again", INCLUDING INVALID_FILE. IT USED TO READ
            //"Unreadable", WHICH TOLD SOMEBODY WHOSE SUBSCRIPTION HAD JUST ENDED THAT
            //THEIR WORK WAS BROKEN - AT THE EXACT MOMENT THEY TRUST US LEAST, AND
            //USUALLY UNTRUE. THE COMMON CAUSE IS THE PURITY GATE REFUSING TO SIGN AN
            //IMPORTED SVG THAT CARRIES <script> OR AN on* ATTRIBUTE. THE DESIGN IS
            //FINE; WE SIMPLY WILL NOT PUT OUR SIGNATURE ON IT.
            //
            //THE at MARKER IN THE RESPONSE STILL NAMES WHICH BRANCH FIRED - gunzip,
            //empty_content OR hostile - SO THE NETWORK TAB TELLS US WHAT THE CAPTION
            //DELIBERATELY DOES NOT TELL THEM.
            //
            //THE RING GOES AND THE PIN IS RELEASED FIRST: THE CAPTION IS LONGER THAN
            //"Download" AND WOULD BE CLIPPED AT THE FROZEN WIDTH BY overflow:hidden.
            releaseModalButton(btn, label);

            label.innerText = "Try again";

            return;
        }

        file = data.file;
        title = data.title;

        //WRITTEN ONLY AFTER THE ANSWER IS KNOWN GOOD, NEVER BEFORE - A FAILED CALL
        //MUST NOT LEAVE A POISONED KEY BEHIND. connect.js OWNS EVERY CACHE WRITE IN
        //THE APP AND THIS IS NO EXCEPTION.
        try { await storeRecoveredFreeAutosave(userID, title, file); } catch { }
    }

    //purifyTitle LIVES IN fileManager.js. EVERY SCRIPT ON THIS PAGE IS defer, SO IT
    //IS DEFINED LONG BEFORE ANY CLICK - THE GUARD IS THE SAME DEFENSIVE PATTERN THE
    //BOOT SEQUENCE USES, NOT A REAL DOUBT.
    //
    //IT RUNS HERE AND NOT BEFORE THE CACHE WRITE, SO THE SERVER PATH AND THE CACHED
    //PATH ARE BOTH CLEANED BY THIS ONE LINE.
    let name = (typeof purifyTitle === 'function') ? purifyTitle(title) : "Untitled";

    let link = document.createElement('a');

    link.href = URL.createObjectURL(new Blob([file], { type: 'application/x-wondr' }));
    link.download = `${name}.wdr`;
    link.click();

    //REVOKE ON THE NEXT TICK. REVOKING IMMEDIATELY CAN RACE THE BROWSER'S OWN READ
    //OF THE URL AND PRODUCE AN EMPTY FILE.
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);

    //BACK TO "Download", NOT "Downloaded". THE SAVE DIALOG IS UP AND THE BUTTON IS
    //LIVE AGAIN - A SECOND CLICK COSTS NOTHING NOW, IT READS THE CACHE.
    releaseModalButton(btn, label);
}

//THE EXIT FROM THE BUSY STATE, IN ONE PLACE. THE SUCCESS PATH AND ALL THREE FAILURE
//PATHS HAVE TO UNDO EXACTLY THE SAME THREE THINGS, AND THE ONE THAT GETS FORGOTTEN
//LEAVES A DEAD BUTTON SPINNING FOREVER UNDER A MODAL WITH NO WAY OUT.
function releaseModalButton(btn, label) {

    let spinner = document.getElementById('iconSpinModal');

    if(spinner) spinner.remove();

    label.style.display = "";
    btn.style.width = "";
    btn.style.pointerEvents = "";
}

//THE DEAD END, AND THE ONLY EXIT THAT DOES NOT HAND THE BUTTON BACK. THERE IS NOTHING
//TO DOWNLOAD ON THIS ACCOUNT AND THERE NEVER WILL BE, SO THE CONTROL STOPS LOOKING LIKE
//A CONTROL: NO FILL, NO POINTER, JUST A LINE SAYING WHY. THAT LEAVES Subscribe AS THE
//ONLY THING ON THE CARD THAT CAN BE CLICKED, WHICH IS THE HONEST STATE OF THE OFFER.
//
//THE WIDTH PIN IS RELEASED FIRST. THE CAPTION IS LONGER THAN "Download" AND WOULD BE
//CUT OFF AT THE FROZEN WIDTH BY .btnModal h2's overflow: hidden.
function retireModalButton(btn, label, text) {

    let spinner = document.getElementById('iconSpinModal');

    if(spinner) spinner.remove();

    label.style.display = "";
    btn.style.width = "";

    //POINTER EVENTS STAY OFF, UNLIKE EVERY OTHER EXIT.
    btn.style.pointerEvents = "none";
    btn.style.background = "transparent";

    //#btnModalClose h2 IS PAINTED --bg BECAUSE IT NORMALLY SITS ON A --sharp FILL. WITH
    //THE FILL GONE IT WOULD BE NEAR-BLACK TEXT ON A DARK CARD, SO THE COLOUR GOES WITH
    //IT. SET INLINE RATHER THAN IN modal.css - THIS IS A ONE-OFF STATE OF ONE BUTTON,
    //NOT A CLASS ANYTHING ELSE WILL EVER WEAR.
    label.style.color = "var(--sharp)";
    label.innerText = text;
}

//3-4 LETTER MONTH, NO PERIOD. Sept NOT Sep, SO toLocaleString CANNOT DO THIS
function dateWondr(value) {

    if(value == null) return "None";

    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let date = new Date(value);

    return month[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
}

//[5] FETCH AUTOSAVE. ONE RPC RESOLVES THE USER'S ONLINE SAVE SLOT AND CREATES IT
//ON FIRST EVER USE. THE ID IS CACHED FOR THE WHOLE SESSION SO NO AUTOSAVE TICK
//EVER HAS TO GO BACK TO THE TABLE FOR IT.
async function fetchAutoSave() {

  try {

    const { data, error } = await wondrSupabase
    .schema('wondr_users')
    .rpc('get_or_create_file');

    if(error || data == null || data.length == 0) return;

    fileID = data[0].out_file_id;
    autosaveTitle = data[0].out_title;

    //THE OBJECT IS THE ONLY PROOF A SAVE EXISTS - THE ROW IS CREATED BEFORE THE
    //FIRST UPLOAD. list() READS METADATA ONLY, NO BYTES, SO THE BANNER COSTS NOTHING.
    const { data: found } = await wondrSupabase.storage
    .from('wondr_files')
    .list(`save_files/${fileID}`);

    if(found == null || !found.some(o => o.name == 'file.wdr')) return;

    //THERE IS SAVED WORK AND THE USER HAS NOT DECIDED WHAT TO DO WITH IT YET.
    //HOLD THE AUTOSAVE TICK OFF THE SLOT UNTIL THEY ANSWER.
    restorePending = true;

    //SHOW BANNER
    let bannerAutosave = document.getElementById('bannerAutosave');
    bannerAutosave.style.visibility = "visible";

  }
  catch {}
}

//[9] AUTO COUNT THE TIME
async function autoSave() {

    if(isDragging || isResizing || isRotating || isSelecting || isSelecting2) return;

    //NO SLOT MEANS THE BOOT RPC HAS NOT LANDED YET. SKIP THE TICK, DO NOT MINT ONE HERE.
    if(fileID == null) return;

    //NEVER OVERLAP UPLOADS. A SLOW CONNECTION MUST NOT STACK TICKS ON TOP OF EACH OTHER.
    if(saving) return;

    //A SAVE-FAILURE MODAL IS UP. DO NOTHING UNTIL THE USER CLOSES IT - NO RETRY, NO
    //SECOND MODAL. CLOSING IT CLEARS saveModal AND THE NEXT TICK RETRIES CLEANLY.
    if(saveModal) return;

    //THE LAPSE MODAL IS A ONE-WAY LATCH - THERE IS NO CLOSE AND NO WAY BACK TO A
    //WORKING STUDIO, SO THE TICK NEVER RUNS AGAIN. subscriberDowngrade ALSO CLEARS THE
    //INTERVAL; THIS IS THE BELT FOR A TICK ALREADY IN FLIGHT WHEN IT FIRED.
    if(lapsedModal) return;

    if(history[1] != null || history[1] != undefined) {

        //ACCUMULATE WHAT MOVED SINCE THE LAST SAVE. saveMoves > 0 MEANS DIRTY.
        if(tempH != h) {
            saveMoves += Math.abs(h - tempH);
            tempH = h;
        }

        //THE BANNER IS STILL OFFERING TO RESTORE THE SAVED FILE. NOTHING MAY WRITE
        //TO THE SLOT UNTIL THE USER ANSWERS IT - OTHERWISE THE RECOVERY OFFER
        //DESTROYS THE THING IT IS OFFERING. EDITING IS AN ANSWER: THE MOMENT REAL
        //WORK EXISTS THE USER HAS CHOSEN TO START FRESH, SO THE BANNER GOES AND
        //THE SLOT IS THEIRS AGAIN. NO SILENT NEVER-SAVING SESSION EITHER WAY.
        if(restorePending) {

            if(saveMoves == 0) return;

            clearAutosave();
            restorePending = false;
        }

        //STORAGE INGRESS IS FREE, SO SAVE EVERY TICK THE MOMENT SOMETHING CHANGED.
        //NOTHING CHANGED MEANS NOTHING TO RE-UPLOAD - SKIP THE WASTED PUT AND ROW WRITE.
        if(saveMoves > 0) {

            saving = true;

            let content = compileContent();
            let ok = false;

            try {

                //GZIP IN THE BROWSER. THE BYTES GO UP OPAQUE - THE BUCKET IS PRIVATE AND
                //THE OBJECT ONLY EVER RETURNS TO ITS OWNER, SO THERE IS NOTHING TO ENCRYPT.
                //arrayBuffer, NOT blob: supabase-js WRAPS A Blob IN FormData AND THEN
                //IGNORES contentType ENTIRELY, SO THE BUCKET'S MIME ALLOWLIST SEES AN
                //EMPTY TYPE AND 400s. AN ArrayBuffer TAKES THE PLAIN-BODY BRANCH, WHICH
                //IS THE ONLY ONE THAT ACTUALLY SENDS THE content-type HEADER.
                let packed = await new Response(
                    new Blob([content]).stream().pipeThrough(new CompressionStream('gzip'))
                ).arrayBuffer();

                const { error } = await wondrSupabase.storage
                .from('wondr_files')
                .upload(`save_files/${fileID}/file.wdr`, packed, {
                    contentType: 'application/x-wondr',
                    upsert: true
                })


                if(!error) {

                    //THE TITLE LIVES IN THE TABLE, NOT IN THE BYTES. THIS ALSO BUMPS
                    //updated_at THROUGH THE TRIGGER, WHICH IS WHAT DATES THE SAVE.
                    //ONE RPC, NOT A TABLE UPDATE. authenticated HAS NO UPDATE GRANT ON
                    //wondr_files AT ALL NOW - OWNERSHIP AND THE TITLE RULE ARE BOTH
                    //CHECKED IN SQL, WHERE THE BROWSER CANNOT SKIP THEM.
                    await wondrSupabase
                    .schema('wondr_users')
                    .rpc('set_file_title', { p_file_id: fileID, p_title: txtProjectTitle.value });

                    //ANY EDIT MADE DURING THE UPLOAD LEFT tempH BEHIND h, SO THE NEXT
                    //TICK RE-DIRTIES AND SAVES AGAIN. NOTHING IS LOST BY ZEROING HERE.
                    saveMoves = 0;
                    ok = true;
                }

            }
            catch {

            }
            finally {

                //RELEASE THE LOCK WHETHER THE UPLOAD WON, FAILED OR THREW, OR THE NEXT
                //TICK WOULD BE BLOCKED FOREVER.
                saving = false;
            }

            //ONE MODAL PER FAILURE. saveModal HOLDS showModal's true, SO EVERY TICK
            //BYPASSES (TOP GUARD) WHILE IT IS UP. CLOSE CLEARS IT, THE NEXT TICK RETRIES:
            //SILENT IF THE NETWORK CAME BACK, MODAL AGAIN ONCE IF IT DID NOT.
            if(!ok) {

                //ASK THE SERVER WHY BEFORE BLAMING THE NETWORK. AN EXPIRED MEMBER AND
                //A DEAD WIFI BOTH LAND HERE, AND THEY NEED OPPOSITE ANSWERS - ONE IS
                //"TRY AGAIN", THE OTHER IS "YOUR SUBSCRIPTION ENDED".
                //
                //PARSING THE STORAGE ERROR TO TELL THEM APART WOULD MEAN STRING-MATCHING
                //A 403 BODY THAT SUPABASE IS FREE TO RESHAPE. ONE EDGE CALL, ONLY ON A
                //FAILURE, IS THE ANSWER THAT CANNOT BE MISREAD.
                if(!(await stillSubscriber())) {

                    subscriberDowngrade();
                    return;
                }

                saveModal = showModal("Something went wrong", "We are unable to process your request this time. Please check your connection and try again.", "Close", null, 25);

                document.getElementById('btnModalClose').addEventListener('click', e => {
                    hideModal();
                    saveModal = false;
                })
            }
        }
    }

}






