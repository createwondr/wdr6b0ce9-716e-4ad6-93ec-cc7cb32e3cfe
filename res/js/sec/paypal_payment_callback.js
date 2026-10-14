
//THE POPUP LANDING PAGE PAYPAL REDIRECTS BACK TO. IT HANDS THE ORDER ID TO billing.html
//AND CLOSES - SAME JOB AND SAME SHAPE AS google_authentication_callback.js.
//
//[!] NO SUPABASE, NO CAPTURE, NO GRANT HAPPENS HERE. THIS PAGE IS REACHED BY A PLAIN
//[!] REDIRECT FROM PAYPAL, SO ANYONE CAN OPEN IT WITH ANY token IN THE URL. THE ONLY
//[!] THING IT IS TRUSTED TO DO IS REPEAT A STRING. paypal-capture-order READS THE ORDER
//[!] FROM PAYPAL AND CHECKS THE AMOUNT, THE CURRENCY AND THE OWNER BEFORE IT TAKES A
//[!] CENT, SO A FORGED ID BUYS NOTHING.
function passPayPalData() {

    let params = new URLSearchParams(location.search);

    //PAYPAL NAMES THE ORDER ID "token" ON THE RETURN URL. THE cancel FLAG IS OURS -
    //cancel_url IS THE SAME PAGE WITH IT APPENDED, SO ONE FILE COVERS BOTH ENDINGS.
    let orderID = params.get('token');

    //[!] A SUBSCRIPTION COMES BACK ON THE SAME URL BUT UNDER A DIFFERENT NAME - PAYPAL
    //[!] APPENDS subscription_id (AND ba_token) INSTEAD. ONE PAGE SERVES BOTH PRODUCTS,
    //[!] AND WHICH KEY IS PRESENT IS WHAT TELLS billing.js WHICH ONE CAME BACK.
    let subscriptionID = params.get('subscription_id');

    //window.opener IS null IF THIS PAGE WAS OPENED ON ITS OWN RATHER THAN AS OUR POPUP.
    //POSTING TO null THROWS, AND A THROW HERE WOULD STRAND A PAID BUYER ON A BLANK PAGE.
    if(window.opener != null && params.get('cancel') == null && (orderID != null || subscriptionID != null)) {

        window.opener.postMessage({ orderID, subscriptionID }, window.location.origin);
    }

    window.close();
}
passPayPalData();
