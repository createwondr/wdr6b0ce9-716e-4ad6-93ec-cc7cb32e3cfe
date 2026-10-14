const pexelsAPI = "FIwWFg0n3quDkc8ndHzeU14de0svjwwmQ9dgZLKcoDlPW9lgTqstvMKZ";

/////////////////////////GET AES///////////////////////
let dataPexelsCurated, dataPexelsSearched, dataCategory;

async function fetchLimitedCategory(table, start, limit) {
    
    let cacheExist = await caches.has(`res_${table.toLowerCase()}_category`);

    //IF CACHE EXIST, THEN COUNT THE KEYS
    //MUST MATCH THE VALUE COUNT AS PER REQUEST
    if(cacheExist) {
        
        //CACHE IS THE LOCAL FOLDER PATH OF TABLE
        let cache = await caches.open(`res_${table.toLowerCase()}_category`);
        //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
        let keys = await cache.keys();

        //COUNT THE EXISTING KEYS AND COMPARE TO THE VALUE COUNT REQUEST
        //IF GREATER OR EQUAL, LOAD THE KEYS
        
        //USE THE EXISTING CACHE AND KEYS
        //RETURN ALL KEYS AND VALUES IN DATA OBJECT FORM LIKE IN SUPABASE
     
        if(keys.length >= limit) {
            
            let data = await fetchLimitedCategoryFromCache(keys, start, limit)
            .then((data) => {
                return data;
            })
            
            if(data != null && data.length > 0) {

                return data;
            }
            
            else {
                let {data} = await wondrSupabase
                .schema('wondr')
                .from(`res_${table.toLowerCase()}_category`)
                .select()
                .gte('index', start)
                .lte('index', limit)
                .order('index', { ascending: true })

                //STORE TO CACHE AFTER FETCH
                await storeCategoryToCache(table, data)
                return data;
            }
        
        }
        
        //IF EXISTING KEYS ARE LESSER THEN
        //FETCH FROM SUPABASE AND SAVE TO CACHE FOR LATER
        
        else {

            let {data} = await wondrSupabase
            .schema('wondr')
            .from(`res_${table.toLowerCase()}_category`)
            .select()
            .gte('index', start)
            .lte('index', limit)
            .order('index', { ascending: true })

            //STORE TO CACHE AFTER FETCH
            await storeCategoryToCache(table, data)
            return data;
        }
            
    }
    else {
        let {data} = await wondrSupabase
        .schema('wondr')
        .from(`res_${table.toLowerCase()}_category`)
        .select()
        .gte('index', start)
        .lte('index', limit)
        .order('index', { ascending: true })

        //STORE TO CACHE AFTER FETCH
        await storeCategoryToCache(table, data);

        return data;
    }
    
}

async function fetchAllCategory(table) {
    
    let cacheExist = await caches.has(`res_${table.toLowerCase()}_category`);

    //IF CACHE EXIST, THEN COUNT THE KEYS
    //MUST MATCH THE VALUE COUNT AS PER REQUEST
    if(cacheExist) {
        
        //CACHE IS THE LOCAL FOLDER PATH OF TABLE
        let cache = await caches.open(`res_${table.toLowerCase()}_category`);
        //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
        let keys = await cache.keys();

        //COUNT THE EXISTING KEYS AND COMPARE TO THE VALUE COUNT REQUEST
        //IF GREATER OR EQUAL, LOAD THE KEYS
        
        //USE THE EXISTING CACHE AND KEYS
        //RETURN ALL KEYS AND VALUES IN DATA OBJECT FORM LIKE IN SUPABASE
        let data = await fetchAllCategoryFromCache(keys)
        .then((data) => {
            return data;
        })
        
        if(data != null && data.length > 0) {

            return data;
        }
        
        else {
            let {data} = await wondrSupabase
            .schema('wondr')
            .from(`res_${table.toLowerCase()}_category`)
            .select()
            .order('index', { ascending: true })

            //STORE TO CACHE AFTER FETCH
            await storeCategoryToCache(table, data)
            return data;
        }
            
    }
    else {
        let {data} = await wondrSupabase
        .schema('wondr')
        .from(`res_${table.toLowerCase()}_category`)
        .select()
        .order('index', { ascending: true })

        //STORE TO CACHE AFTER FETCH
        await storeCategoryToCache(table, data);

        return data;
    }
    
}

async function fetchLimitedRowsByCategory(table, category, limit) {
    
    let cacheExist = await caches.has(`res_${table.toLowerCase()}`);

    //IF CACHE EXIST, THEN COUNT THE KEYS
    //MUST MATCH THE VALUE COUNT AS PER REQUEST

    if(cacheExist) {

        //CACHE IS THE LOCAL FOLDER PATH OF TABLE
        let cache = await caches.open(`res_${table.toLowerCase()}`);
        //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
        let keys = await cache.keys();

        if(keys.length >= limit) {

            //[!]THIS IS WHERE WE CONTINUE
            let oldData = await fetchLimitedRowsByCategoryFromCache(table, category, limit)
            .then((data) => {
                return data;
            })
            
            let tagged = Object.values(oldData).find(d => d.tags.includes(category.toLowerCase()))

            if(tagged == null || tagged == undefined) {

                let { data } = await wondrSupabase
                .schema('wondr')
                .from(`res_${table.toLowerCase()}`)
                .select()
                .ilike('tags', `%${category.toLowerCase()}%`)
                .eq('feature', 'true')
                .limit(limit)
                .order('index', { ascending: true })

                await storeResourcesToCache(table, data)
                return [...oldData, ...data]
            }
            else {

                return oldData
            }

        }
        
        //IF EXISTING KEYS ARE LESSER THEN
        //FETCH FROM SUPABASE AND SAVE TO CACHE FOR LATER
        
        else {

            let { data } = await wondrSupabase
            .schema('wondr')
            .from(`res_${table.toLowerCase()}`)
            .select()
            .ilike('tags', `%${category.toLowerCase()}%`)
            .eq('feature', 'true')
            .limit(limit)
            .order('index', { ascending: true })

            await storeResourcesToCache(table, data)

            return data;
        }
            
    }
    else {
        
        let { data } = await wondrSupabase
        .schema('wondr')
        .from(`res_${table.toLowerCase()}`)
        .select()
        .ilike('tags', `%${category.toLowerCase()}%`)
        .eq('feature', 'true')
        .limit(limit)
        .order('index', { ascending: true })

        await storeResourcesToCache(table, data)
        return data;
        
    }
    
}

async function fetchAllRowsByCategory(table, category) {

    //NOW CHECK IF THE CACHE OF TABLE / FOLDER EXIST
    let cacheExist = await caches.has('res_' + table);

    //COMPILE ALL NAMES
    let exception = ``;

    let newData = [];

    //IF CACHE EXIST, THEN COUNT THE KEYS
    //MUST MATCH THE VALUE COUNT AS PER REQUEST
    if(cacheExist) {

        newData = await fetchAllRowsByCategoryFromCache(table, category)
        .then((newData) => {
            
            newData = newData.filter(() => true);
            return newData;
        })

        for(let a = 0; a < newData.length; a++) {

            if(newData[a]) {
                exception += newData[a].id + ',';
            }       
        }

    }

    exception = `(${exception})`;

    let {data} = await wondrSupabase
    .schema('wondr')
    .from(`res_${table.toLowerCase()}`)
    .select()
    .ilike('tags', `%${category.toLowerCase()}%`)
    .order('index', { ascending: true })
    .not('id', 'in', exception);
    
    //STORE TO CACHE AFTER FETCH
    await storeResourcesToCache(table, data)

    setTimeout(() => {
        data = null;
    }, 3000)

    //IN THIS PART INSTEAD OF RETURNING ALL DATA
    //WE ONLY RETURN DATA[0] DIRECTLY
    //SINCE THIS ONLY RETURNS 1 RESPONSE
    //ALSO THIS IS TO BE UNIFORMED IN CACHE FETCHING
    //SINCE WE CANT RETURN DATA OBJECT USING CACHE AS IT WILL RETURN ALL RESPONSES

    if(newData && data.length > 0 && data != null) {
        return [...data, ...newData];
    }
    else if(newData && data.length == 0 || data != null) {

        return newData;
    }
    else if(newData == null && data.length > 0 && data != null) {
 
        return data
    }

}

async function fetchLimitedTemplates(limit) {

    let cacheData = await fetchLimitedTemplatesFromCache(limit)

    if(cacheData.length == 0) {

        let {data} = await wondrSupabase
        .schema('wondr')
        .from(`res_templates`)
        .select()
        .order('index', { ascending: false })
        .limit(limit);

        await storeResourcesToCache('templates', data);

        return data;
    }
    else {

        let {data} = await wondrSupabase
        .schema('wondr')
        .from(`res_templates`)
        .select()
        .order('index', { ascending: false })
        .limit(limit)

        let latestIndex = data[0].index;

        let cacheIndex = cacheData[0].index;

        if(latestIndex > cacheIndex) {

            let diff = latestIndex - cacheIndex;

            if(diff < limit) {

                let {data} = await wondrSupabase
                .schema('wondr')
                .from(`res_templates`)
                .select()
                .order('index', { ascending: false })
                .limit(diff);

                await storeResourcesToCache('templates', data);

                let newData = [...data, ...cacheData]
                return newData;
            }

            else {

                let {data} = await wondrSupabase
                .schema('wondr')
                .from(`res_templates`)
                .select()
                .order('index', { ascending: false })
                .limit(limit)

                await storeResourcesToCache('templates', data);

                return data;
            }
            
        }
        else {
    
            return cacheData;
        }

    }
}

async function fetchRowById(table, id) {

    let cacheExist = await caches.has(`res_${table.toLowerCase()}`);

    //IF CACHE EXIST, THEN COUNT THE KEYS
    //MUST MATCH THE VALUE COUNT AS PER REQUEST
    if(cacheExist) {
        //COUNT THE EXISTING KEYS AND COMPARE TO THE VALUE COUNT REQUEST
        //IF GREATER OR EQUAL, LOAD THE KEYS
        
        let data = await fetchRowByIdFromCache(table, id)
        .then((data) => {
            return data;
        })

        if(data != null && data.length > 0) {
            return data;
        }
        
        else {
            let {data} = await wondrSupabase
            .schema('wondr')
            .from(`res_${table.toLowerCase()}`)
            .select()
            .eq('id', id)

            await storeResourcesToCache(table, data);

            return data;
        }
          
    }
    else {
        
        let {data} = await wondrSupabase
        .schema('wondr')
        .from(`res_${table.toLowerCase()}`)
        .select()
        .eq('id', id)

        await storeResourcesToCache(table, data)

        return data;

    }

}

async function fetchLimitedFonts(table, start, limit) {

    //GET EXACT COUNT OF TARGET VALUES
    //let configScroll = document.querySelectorAll('.configScroll')[4];
    //let maxEntries = Math.round(configScroll.clientHeight / 66) + 1; //50px for wrapFonts + 1em margin

    //NOW CHECK IF THE CACHE OF TABLE / FOLDER EXIST
    let cacheExist = await caches.has('res_font_' + table);

    //IF CACHE EXIST, THEN COUNT THE KEYS
    //MUST MATCH THE VALUE COUNT AS PER REQUEST
    if(cacheExist) {
        //CACHE IS THE LOCAL FOLDER PATH OF TABLE
        let cache = await caches.open('res_font_' + table);
        //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
        let keys = await cache.keys();

        //COUNT THE EXISTING KEYS AND COMPARE TO THE VALUE COUNT REQUEST
        //IF GREATER OR EQUAL, LOAD THE KEYS
        
        //USE THE EXISTING CACHE AND KEYS
        //RETURN ALL KEYS AND VALUES IN DATA OBJECT FORM LIKE IN SUPABASE
        
        if(keys.length >= limit) {
            let data = await fetchLimitedFontsFromCache(cache, keys, start, limit)
            .then((data) => {
                return data;
            })
            
            if(data && data.length > 0) {
                return data;
            }
            else {
                let {data} = await wondrSupabase
                .schema('wondr')
                .from(`res_font_${table}`)
                .select()
                .gte('index', start)
                .lte('index', limit)
                .order('index', { ascending: false })

                //STORE TO CACHE AFTER FETCH
                await storeFontsToCache(table, data)
                return data;
            }
        }
        
        //IF EXISTING KEYS ARE LESSER THEN
        //FETCH FROM SUPABASE AND SAVE TO CACHE FOR LATER
        else {

            let {data} = await wondrSupabase
            .schema('wondr')
            .from(`res_font_${table}`)
            .select()
            .gte('index', start)
            .lte('index', limit)
            .order('index', { ascending: false })

            //STORE TO CACHE AFTER FETCH
            await storeFontsToCache(table, data)
            return data;
        }
    }
    else {
        let {data} = await wondrSupabase
        .schema('wondr')
        .from(`res_font_${table}`)
        .select()
        .gte('index', start)
        .lte('index', limit)
        .order('index', { ascending: false })

        //STORE TO CACHE AFTER FETCH
        await storeFontsToCache(table, data)
        return data;
    }
    
}

async function fetchFontByName(table, font) {

    //NOW CHECK IF THE CACHE OF TABLE / FOLDER EXIST
    let cacheExist = await caches.has('res_font_' + table);

    //IF CACHE EXIST, THEN COUNT THE KEYS
    //MUST MATCH THE VALUE COUNT AS PER REQUEST
    if(cacheExist) {
        //CACHE IS THE LOCAL FOLDER PATH OF TABLE
        let cache = await caches.open('res_font_' + table);
        //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
        let keys = await cache.keys();
        let data = await fetchFontFromCache(cache, keys, font)

        if(data == null || data == undefined) {

            let {data} = await wondrSupabase
            .schema('wondr')
            .from(`res_font_${table}`)
            .select()
            .eq('name', font)

            //STORE TO CACHE AFTER FETCH
            await storeFontsToCache(table, data)
            //IN THIS PART INSTEAD OF RETURNING ALL DATA
            //WE ONLY RETURN DATA[0] DIRECTLY
            //SINCE THIS ONLY RETURNS 1 RESPONSE
            //ALSO THIS IS TO BE UNIFORMED IN CACHE FETCHING
            //SINCE WE CANT RETURN DATA OBJECT USING CACHE AS IT WILL RETURN ALL RESPONSES
            return data[0];
        }
        else {
            return data
        }

    }
    else{ 
        let {data} = await wondrSupabase
        .schema('wondr')
        .from(`res_font_${table}`)
        .select()
        .eq('name', font)

        //STORE TO CACHE AFTER FETCH
        await storeFontsToCache(table, data)
        //IN THIS PART INSTEAD OF RETURNING ALL DATA
        //WE ONLY RETURN DATA[0] DIRECTLY
        //SINCE THIS ONLY RETURNS 1 RESPONSE
        //ALSO THIS IS TO BE UNIFORMED IN CACHE FETCHING
        //SINCE WE CANT RETURN DATA OBJECT USING CACHE AS IT WILL RETURN ALL RESPONSES
        return data[0];
    }
    
}

async function fetchFontsByTag(table, keyword) {

    //NOW CHECK IF THE CACHE OF TABLE / FOLDER EXIST
    let cacheExist = await caches.has('res_font_' + table);

    //COMPILE ALL NAMES
    let exception = ``;

    let newData = [];

    //IF CACHE EXIST, THEN COUNT THE KEYS
    //MUST MATCH THE VALUE COUNT AS PER REQUEST
    if(cacheExist) {
        //CACHE IS THE LOCAL FOLDER PATH OF TABLE
        let cache = await caches.open('res_font_' + table);
        //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
        let keys = await cache.keys();

        newData = await fetchFontsByTagFromCache(cache, keys , keyword)
        .then((newData) => {
           
            return newData;
        })

        for(let b = 0; b < newData.length; b++) {

            if(newData[b]) {
                exception += newData[b].name + ',';
            }
        } 
    }

    //REFORMAT EXCEPTION BY ADDING PARENTHESIS
    
    exception = `(${exception})`;
    
    let {data} = await wondrSupabase
    .schema('wondr')
    .from(`res_font_${table}`)
    .select()
    .ilike('tags', `%${keyword}%`)
    .not('name', 'in', exception);

    //STORE TO CACHE AFTER FETCH
    //await storeFontsToCache(table, data)
    //IN THIS PART INSTEAD OF RETURNING ALL DATA
    //WE ONLY RETURN DATA[0] DIRECTLY
    //SINCE THIS ONLY RETURNS 1 RESPONSE
    //ALSO THIS IS TO BE UNIFORMED IN CACHE FETCHING
    //SINCE WE CANT RETURN DATA OBJECT USING CACHE AS IT WILL RETURN ALL RESPONSES

    if(newData != null && data.length > 0) {
        return [...newData, ...data];
    }
    else if(newData != null && data.length == 0) {
        return newData;
    }
    else if(newData == null && data.length > 0) {
        return data
    }
}

let stylishLength, serifLength, sansSerifLength;
let fontKeywords = "";

async function fetchStylishLength() {

    //THIS NO NEED TO CACHE AS THIS SHOULD ALWAYS BE UPDATED
    //ALSO NOT BANDWIDTH EXPENSIVE
    let {data} = await wondrSupabase
    .schema('wondr')
    .from(`res_font_stylish`)
    .select();  // Only return count, not data

    //THE wondr SCHEMA IS AUTH + WHITELIST ONLY NOW, SO A DENIED READ RETURNS
    //null. WITHOUT THIS GUARD data.length THROWS AND fontKeywords STAYS EMPTY.
    if(data == null) return;

    stylishLength = data.length;

    //THE WHOLE TABLE IS HERE ANYWAY, SO THE CACHE IS REBUILT FROM IT ON EVERY BOOT. NOTHING ELSE EVER REFRESHED IT, AND AFTER
    //THE 2026-10-04 FONTS SQL A BROWSER STILL SHOWED THE OLD ROWS 0-31 (TISA, IMF SERIF, BROKEN LINKS) THAT NEVER LOAD
    await caches.delete('res_font_stylish');
    await storeFontsToCache('stylish', data);

    //THE ROWS ALREADY IN THE LIST (design.html STARTS WITH 12) FOLLOW THE TABLE: A ROW WHOSE INDEX NOW HOLDS ANOTHER FONT IS
    //REFILLED, A ROW PAST THE END OF THE TABLE GOES
    tabStylish.querySelectorAll('.wrapFonts[data-thumbno]').forEach((wrapFont) => {

        let font = data.find((font) => font.index == wrapFont.dataset.thumbno);

        if(font == null) wrapFont.remove();
        //tabFonts.js LOADS AFTER THIS FILE, SAME GUARD auth2.0.js USES FOR fetchStylishLength
        else if(wrapFont.dataset.font != font.name && typeof fillFontRow === 'function') fillFontRow(wrapFont, font);
    });
    
    for(let a = 0; a < data.length; a++) {

        if(data[a] != null) {
            fontKeywords += `${data[a].name.toLowerCase()}-${data[a].class}, `;
        }
        
    }
}

async function fetchSerifLength() {

    //THIS NO NEED TO CACHE AS THIS SHOULD ALWAYS BE UPDATED
    //ALSO NOT BANDWIDTH EXPENSIVE
    let {data} = await wondrSupabase
    .schema('wondr')
    .from(`res_font_serif`)
    .select();  // Only return count, not data

    //THE wondr SCHEMA IS AUTH + WHITELIST ONLY NOW, SO A DENIED READ RETURNS
    //null. WITHOUT THIS GUARD data.length THROWS AND fontKeywords STAYS EMPTY.
    if(data == null) return;

    serifLength = data.length;

    //THE WHOLE TABLE IS HERE ANYWAY, SO THE CACHE IS REBUILT FROM IT ON EVERY BOOT. NOTHING ELSE EVER REFRESHED IT, AND AFTER
    //THE 2026-10-04 FONTS SQL A BROWSER STILL SHOWED THE OLD ROWS 0-31 (TISA, IMF SERIF, BROKEN LINKS) THAT NEVER LOAD
    await caches.delete('res_font_serif');
    await storeFontsToCache('serif', data);

    //THE ROWS ALREADY IN THE LIST (design.html STARTS WITH 12) FOLLOW THE TABLE: A ROW WHOSE INDEX NOW HOLDS ANOTHER FONT IS
    //REFILLED, A ROW PAST THE END OF THE TABLE GOES
    tabSerif.querySelectorAll('.wrapFonts[data-thumbno]').forEach((wrapFont) => {

        let font = data.find((font) => font.index == wrapFont.dataset.thumbno);

        if(font == null) wrapFont.remove();
        //tabFonts.js LOADS AFTER THIS FILE, SAME GUARD auth2.0.js USES FOR fetchStylishLength
        else if(wrapFont.dataset.font != font.name && typeof fillFontRow === 'function') fillFontRow(wrapFont, font);
    });

    for(let a = 0; a < data.length; a++) {

        if(data[a] != null) {
            fontKeywords += `${data[a].name.toLowerCase()}-${data[a].class}, `;
        }
        
    }
}

async function fetchSansSerifLength() {

    //THIS NO NEED TO CACHE AS THIS SHOULD ALWAYS BE UPDATED
    //ALSO NOT BANDWIDTH EXPENSIVE
    let {data} = await wondrSupabase
    .schema('wondr')
    .from(`res_font_sans_serif`)
    .select();  // Only return count, not data

    //THE wondr SCHEMA IS AUTH + WHITELIST ONLY NOW, SO A DENIED READ RETURNS
    //null. WITHOUT THIS GUARD data.length THROWS AND fontKeywords STAYS EMPTY.
    if(data == null) return;

    sansSerifLength = data.length;

    //THE WHOLE TABLE IS HERE ANYWAY, SO THE CACHE IS REBUILT FROM IT ON EVERY BOOT. NOTHING ELSE EVER REFRESHED IT, AND AFTER
    //THE 2026-10-04 FONTS SQL A BROWSER STILL SHOWED THE OLD ROWS 0-31 (TISA, IMF SERIF, BROKEN LINKS) THAT NEVER LOAD
    await caches.delete('res_font_sans_serif');
    await storeFontsToCache('sans_serif', data);

    //THE ROWS ALREADY IN THE LIST (design.html STARTS WITH 12) FOLLOW THE TABLE: A ROW WHOSE INDEX NOW HOLDS ANOTHER FONT IS
    //REFILLED, A ROW PAST THE END OF THE TABLE GOES
    tabSansSerif.querySelectorAll('.wrapFonts[data-thumbno]').forEach((wrapFont) => {

        let font = data.find((font) => font.index == wrapFont.dataset.thumbno);

        if(font == null) wrapFont.remove();
        //tabFonts.js LOADS AFTER THIS FILE, SAME GUARD auth2.0.js USES FOR fetchStylishLength
        else if(wrapFont.dataset.font != font.name && typeof fillFontRow === 'function') fillFontRow(wrapFont, font);
    });

    for(let a = 0; a < data.length; a++) {

        if(data[a] != null) {
            fontKeywords += `${data[a].name.toLowerCase()}-${data[a].class}, `;
        }
        
    }

}














//////////////////////ONE LOADER PER LIST AT A TIME/////////////////////////
//sir, 2026-09-27: "the loading overlaps... there's some conflict with results since first
//loading might be the last result". EVERY LOADER BELOW AWAITS THE NETWORK AND THEN WRITES THE
//LIST, THE FOOTER AND THE SHARED dataPexelsCurated / dataPexelsSearched / dataCategory. Go back
//STARTS THE KEYWORD PREVIEW, x STARTS THE DEFAULT ONE, BOTH ON THE SAME configScroll, AND
//WHICHEVER ANSWERED LAST WON - THE KEYWORD RESULTS COULD LAND AFTER THE BOX WAS CLEARED, WITH
//dataPexels* NO LONGER MATCHING THE THUMBS createCanvasImage LOOKS THE PHOTO UP IN. EACH LOADER
//TAKES A TICKET WHEN IT STARTS, AND AFTER EVERY await ONLY THE NEWEST TICKET ON THAT LIST MAY
//GO ON. A WeakMap SO NOTHING IS WRITTEN INTO THE DOM
let previewTickets = new WeakMap();

function takePreviewTicket(configScroll) {

    let ticket = (previewTickets.get(configScroll) || 0) + 1;

    previewTickets.set(configScroll, ticket);

    return ticket;
}

function isStaleTicket(configScroll, ticket) {
    return previewTickets.get(configScroll) != ticket;
}

////////////////////SEARCHING ON CONTENT PREVIEW//////////////////////////
async function searchContentPreview(configScroll, table, keyword) {

    let ticket = takePreviewTicket(configScroll);

    //DO NOT RELOCATE SHOWFILLERS
    //THIS SEQUENCE IS CORRECT
    await showFillers(configScroll);
    if(isStaleTicket(configScroll, ticket)) return;

    let menuFooter = configScroll.closest('.menu').querySelector('.menuFooter');
    menuFooter.innerHTML = ``;
    
    let data;
    let content = "";

    let fetchedCategories = await fetchAllCategory(table);
    if(isStaleTicket(configScroll, ticket)) return;
    dataCategory = fetchedCategories;

    for(let a = 0; a < dataCategory.length; a++) {

        let append = "";
        let count = 0;
        let category = dataCategory[a].category;

        if(category == "Images") {

            let fetchedPhotos = await fetchImagePreview(keyword, 1);
            if(isStaleTicket(configScroll, ticket)) return;
            dataPexelsSearched = null;
            dataPexelsCurated = fetchedPhotos;
            
            for(let b = 0; b < 4; b++) {

                append += 
                `<div class="thumbPreviewMini" style="width: 118px; height: 118px;" data-type="image" data-cloudid = "${dataPexelsCurated.photos[b].id}" data-post="center" data-host="pexels" data-thumbno="${b}" data-photog = "${dataPexelsCurated.photos[b].photographer}" data-photogurl = "${dataPexelsCurated.photos[b].photographer_url}">
                    <div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                        <img src = "${dataPexelsCurated.photos[b].src.medium}">
                    </div>
                </div>`;
            }

            if(append != "") {

                content += 
                `<div class = "wrapEntries">
                    <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">View all</h2></div></div>
                    <div class="wrapThumbs" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: auto;">${append}</div>
                </div>`;
            }

        }

        else if(category == "Graphics") {

            append = "";
            count = 0;

            //FETCH ALL ROWS USING CATEGORY
            data = await fetchAllRowsByCategory(table, category)
            if(isStaleTicket(configScroll, ticket)) return;
            
            data = data.filter(() => true);

            //APPEND 3 THUMBS STRING
            for(let b = 0; b < data.length; b++) {

                if(data[b] != null) {

                    if(count <= 3) {

                        let tag = data[b].tags.split(', ');

                        for(let c = 0; c < tag.length; c++) {

                            if(tag[c].startsWith(keyword.toLowerCase()) || tag[c].includes(keyword.toLowerCase()) || keyword.includes(tag[c].toLowerCase()) || keyword.toLowerCase() == tag[c].toLowerCase()) {

                                count++;

                                if(data[b].type == 'raster graphics') {
                                    
                                    append += 
                                    `<div class="thumbPreviewMini" style="width: 118px; height: 118px;" data-id="${data[b].id}" data-type="${data[b].type}" data-cloudid = "${data[b].index}" data-post="${data[b].post}">
                                        <div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                                            <img src="${data[b].thumbs}">
                                        </div>
                                    </div>`;
                                }

                                break;
                            }
                        }
                    }

                    else {
                        break;
                    }
              
                }
            }

            if(append != "") {

                if(count >= 4) {
                    content += 
                    `<div class = "wrapEntries">
                        <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">View all</h2></div></div>
                        <div class="wrapThumbs" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: auto;">${append}</div>
                    </div>`;
                }
                else {
                    content += 
                    `<div class = "wrapEntries">
                        <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2></div>
                        <div class="wrapThumbs" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: auto;">${append}</div>
                    </div>`;
                }
                
            }   
        }

        else {

            //FETCH ALL ROWS USING CATEGORY
            data = await fetchAllRowsByCategory(table, category)
            if(isStaleTicket(configScroll, ticket)) return;
            
            //APPEND 3 THUMBS STRING
            for(let b = 0; b < data.length; b++) {

                if(data[b] != null) {

                    if(count <= 2) {

                        let tag = data[b].tags.split(', ');

                        for(let c = 0; c < tag.length; c++) {

                            if(tag[c].startsWith(keyword.toLowerCase()) || tag[c].includes(keyword.toLowerCase())) {
                        
                                count++;

                                if(data[b].type == '3D mockup') {
                    
                                    append += 
                                    `<div class="thumbPreviewMini" data-id="${data[b].id}" data-type="${data[b].type}" data-cloudid = "${data[b].index}" data-artist="${data[b].artist}" data-artisturl="${data[b].artist_url}" data-aspectratio="${data[b].aspect_ratio}" data-modelcolor="${data[b].model_color}">
                                        <div class = "hoverPreviewMini">
                                            ${data[b].source}
                                        </div>
                                    </div>`;

                                }
                                else {

                                    append += 
                                    `<div class="thumbPreviewMini" data-id ="${data[b].id}" data-type="${table == "patterns"? "patterns": data[b].type}" data-cloudid = "${data[b].index}" data-post="${table == "patterns"? "center": data[b].post}" data-thumbno="${b}">
                                        <div class = "hoverPreviewMini" style="margin: auto; display: flex;">
                                            ${data[b].source}
                                        </div>
                                    </div>`;
                                }

                                break;
                            }
                        }
                    }
                    else {

                        break;
                    }
                }
            }

            if(append != "") {
                
                //APPEND THE 3 THUMBS INSIDE THE WRAPENTRIES
                //IF 3 OR MORE, SHOW VIEW ALL
                if(count > 2) {
                    content += 
                    `<div class = "wrapEntries">
                        <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">View all</h2></div></div>
                        <div class="wrapThumbs">${append}</div>
                    </div>`;
                }
                //ELSE, REMOVE VIEW ALL
                else {
                    content += 
                    `<div class = "wrapEntries">
                        <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2></div>
                        <div class="wrapThumbs">${append}</div>
                    </div>`;
                }
            }
        }
    }

    configScroll.querySelector('.contentPreview').innerHTML = content;
}

async function searchContentPreviewTemplates(keyword) {

    //DO NOT RELOCATE SHOWFILLERS
    //THIS SEQUENCE IS CORRECT
    let configScroll = document.querySelector('.configScroll');
    let ticket = takePreviewTicket(configScroll);
    await showFillers(configScroll)
    if(isStaleTicket(configScroll, ticket)) return;

    //SET TIMEOUT SO IT'S NOT TOO FAST TO REMOVE FILLERS
    setTimeout(async () => {

        if(isStaleTicket(configScroll, ticket)) return;

        let content = "";
        let append = "";

        let limit = countThumbLimits(118) * 2;
        let data = await fetchLimitedTemplatesFromCache(limit);
        if(isStaleTicket(configScroll, ticket)) return;

        //APPEND 3 THUMBS STRING
        for(let b = 0; b < data.length; b++) {

            if(data[b] != null) {

                let tag = data[b].tags.split(', ');

                for(let c = 0; c < tag.length; c++) {

                    if(tag[c].startsWith(keyword.toLowerCase()) || tag[c].includes(keyword.toLowerCase()) || keyword.includes(tag[c].toLowerCase()) || keyword.toLowerCase() == tag[c].toLowerCase()) {
    
                        //data-index IS WHAT THE DOUBLE CLICK OPENS BY
                        append += 
                        `<div class="thumbPreviewMini" style="width: 246px; height: 246px;" data-index="${data[b].index}" data-id="${data[b].id}" data-type="${data[b].type}" data-cloudid = "${data[b].index}" data-post="${data[b].post}" data-thumbno = "${data[b].thumbno}">
                            <div class = "hoverPreviewMini" style="width: 226px; height: 226px;">
                                <img src="${data[b].thumbs}" style="width: 100%; height: 100%">
                            </div>
                        </div>`;

                        //ONE TILE PER TEMPLATE, A SECOND MATCHING TAG LISTED IT TWICE
                        break;
                    }
                }
            }
        }

        if(append != "") {

            content += 
            `<div class = "wrapEntries">
                <div class="wrapThumbs" style="display: grid; grid-template-columns: 1fr;">${append}</div>
            </div>`;
        }   

        configScroll.querySelector('.contentPreview').innerHTML = content;

    }, 300)
}

async function searchContentCategory(category, configScroll, table, keyword) {

    let ticket = takePreviewTicket(configScroll);

    //DO NOT RELOCATE SHOWFILLERS
    //THIS SEQUENCE IS CORRECT
    await showFillers(configScroll);
    if(isStaleTicket(configScroll, ticket)) return;

    let menuFooter = configScroll.closest('.menu').querySelector('.menuFooter');
    
    let append = "";
    let count = 0;
    let content = "";

    if(category == "Images") {

        let limit = countThumbLimits(118) * 2;
        let fetchedPhotos = await fetchImagePreview(keyword, 1);
        if(isStaleTicket(configScroll, ticket)) return;
        dataPexelsCurated = null;
        dataPexelsSearched = fetchedPhotos;

        for(let a = 0; a < limit; a++) {

            if(dataPexelsSearched.photos[a] != null) {
                append += 
                `<div class="thumbPreviewMini" style="width: 118px; height: 118px;" data-type="image" data-cloudid = "${dataPexelsSearched.photos[a].id}" data-post="center" data-host="pexels" data-thumbno="${a}" data-photog = "${dataPexelsSearched.photos[a].photographer}" data-photogurl = "${dataPexelsSearched.photos[a].photographer_url}">
                    <div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                        <img src="${dataPexelsSearched.photos[a].src.medium}">
                    </div>
                </div>`;
            }
            
        }

        if(append != "") {

            content = 
            `<div class = "wrapEntries">
                <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">Go back</h2></div></div>
                <div class="wrapThumbScroller">
                    <div class="wrapThumbImages">
                        ${append}
                    </div>
                </div>
            </div>`;
        }

        menuFooter.innerHTML = 
        `<a href = "https://pexels.com" target="blank" style="width: 100px; height: 20px; margin: auto; display: flex; text-decoration: none;">
            <p style="color: var(--sharp); white-space: nowrap; margin: auto; font-weight: 100; font-size: 10px; letter-spacing: 1px;">More on</p>
            <?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <svg xmlns="http://www.w3.org/2000/svg" width="85" height="38" viewBox="0 0 512 227" style="margin: auto; width:100%; height: 100%; cursor: pointer">
                <path fill="white" d="M511.187 131.02C509.164 120.486 506.384 114.524 503.211 107.417C501.187 102.884 499.317 98.6027 498.694 95.7914C497.152 88.8342 497.908 80.1165 498.265 76.9559H479.596L476.451 81.9607C469.281 93.3721 453.608 118.338 453.607 118.339C444.924 131.386 434.121 147.618 418.553 153.758C415.613 154.751 409.393 156.767 404.469 151.122C399.777 145.744 400.185 139.937 400.204 139.692L400.223 139.433L400.235 139.275L400.351 139.165L400.543 138.982C421.115 119.456 440.747 98.0267 450.557 84.3877C461.856 68.6797 467.522 55.7517 471.946 44.8671C474.701 38.0835 480.429 21.0609 474.129 9.53638C471.495 4.71716 467.034 1.44608 461.567 0.325525C460.497 0.106481 459.471 0 458.432 0C446.837 0 433.098 14.565 416.43 44.5274C402.557 69.4604 392.695 90.8751 387.12 108.177C384.235 117.129 382.339 128.47 382.339 128.471C381.714 129.595 370.375 142.671 359.178 150.087C355.43 152.569 349.908 155.638 342.002 155.638C334.841 155.638 328.199 151.258 328.197 151.257C328.2 151.256 339.703 145.052 358.243 126.848C368.262 117.009 372.497 103.566 369.295 91.7638C364.27 73.2637 346.588 71.826 341.288 71.826C326.515 71.8713 314.504 81.4527 308.708 89.6434C294.733 109.381 295.344 125.544 297.439 137.419C298.118 141.257 299.355 145.038 301.115 148.654L301.29 149.012C301.288 149.013 279.271 164.432 266.053 146.596C260.98 139.75 253.158 125.537 253.157 125.534L299.238 76.9613H274.472C258.72 93.2817 243.999 108.701 243.996 108.704C243.995 108.701 233.145 87.9123 227.999 76.9559H207.991C209.743 80.4129 211.508 83.9821 213.435 87.8768C219.788 100.719 230.978 122.349 230.979 122.351C230.978 122.353 226.203 127.339 226.202 127.341C223.675 129.967 215.982 137.958 203.609 145.553C196.697 149.788 189.441 152.685 181.427 154.409C175.157 155.759 167.083 155.908 162.222 154.604C159.442 153.858 154.206 151.303 154.206 151.303C154.208 151.301 168.684 142.237 184.317 126.858C194.327 117.011 198.563 103.568 195.371 91.7732C190.344 73.2768 172.662 71.8395 167.362 71.8395C152.593 71.8845 140.578 81.4614 134.777 89.6491C120.804 109.375 121.416 125.547 123.511 137.432C124.127 140.925 126.491 147.497 126.491 147.497C115.785 153.142 105.638 156.512 93.2508 156.956C92.1763 156.995 87.5926 157.012 86.1204 156.934C85.7569 156.915 84.623 156.763 84.623 156.763C84.6237 156.763 87.2107 155.105 87.8157 154.692C103.092 144.267 109.834 125.528 110.298 108.996C110.682 95.3566 107.46 84.338 101.226 77.974C97.3124 73.9742 92.1345 71.9054 85.8352 71.826H85.5688C74.4682 71.826 61.8243 78.4821 53.018 86.7525C50.955 88.6901 45.1151 95.26 45.1149 95.2603L48.7384 76.9532H29.566L0 226.271H19.1834L36.48 138.885C40.2234 122.447 45.9629 112.029 56.9644 101.665L57.1455 101.51C59.8693 99.1994 62.9849 97.0036 65.918 95.328C70.7655 92.5572 75.1511 91.152 78.9529 91.152C81.208 91.152 83.2428 91.6543 85.0023 92.6447C91.2279 96.1683 91.9858 104.727 92.3933 109.326C93.9896 127.445 80.0006 139.727 78.4002 141.068C73.7991 144.917 68.9992 146.788 63.7256 146.788C56.6649 146.788 51.3729 144.284 48.4039 142.896C48.2907 143.445 47.5469 147.095 47.5469 147.095C46.8113 150.765 45.389 158.138 45.3888 158.139C53.0786 164.721 68.412 172.104 88.6396 173.266C90.28 173.362 91.9431 173.41 93.5821 173.41C108.447 173.41 123.012 169.522 136.873 161.854L137.135 161.71L137.36 161.904C142.623 166.436 147.692 168.647 149.358 169.373C159.042 173.596 169.583 173.335 170.617 173.335C183.411 173.335 195.361 169.647 198.718 168.517C219.995 161.354 232.065 147.959 236.609 142.977L240.074 139.324L242.274 143.381C245.181 148.764 248.476 154.865 254.285 161.506C256.697 164.264 265.809 173.26 281.817 173.26C297.013 173.26 312.644 162.989 312.645 162.988C312.648 162.991 317.775 167.024 323.309 169.632C330.243 172.899 338.323 173.252 341.475 173.252C357.227 173.252 370.233 167.39 383.645 154.243L384.105 153.792C384.106 153.794 386.055 158.429 387.734 160.845C396.363 173.254 407.477 173.294 411.374 173.294C414.976 173.294 421.025 172.67 425.577 170.911C445.916 163.047 461.71 141.167 469.314 128.825C469.315 128.823 475.112 119.634 481.964 105.539L483.494 102.455C483.495 102.456 487.147 111.122 487.148 111.125C489.25 116.226 491.21 121.908 492.143 125.6C494.718 135.576 496.443 144.345 491.431 150.591C488.987 153.607 483.95 156.851 478.666 156.851C475.899 156.851 473.29 155.986 470.912 154.279C470.011 153.616 469.077 152.78 468.125 151.79C464.24 156.638 460.211 161.063 456.139 164.956C459.638 167.489 467.811 173.453 480.048 173.453C483.773 173.453 489.075 172.493 492.539 170.772C506.635 163.769 514.679 149.203 511.187 131.02ZM408.648 103.39L410.031 99.942C415.213 87.0267 422.71 71.8007 432.95 53.394C444.791 32.107 452.665 23.6148 456.304 20.4475L457.405 19.4904L458.066 18.9154L458.107 19.782L458.176 21.2241C458.376 25.5125 456.987 31.7896 454.461 38.0155C450.253 48.3681 445.298 59.6522 435.181 73.718C430.12 80.7499 421.854 90.4729 411.905 101.095L409.353 103.823L407.815 105.467L408.648 103.39ZM145.307 136.878L144.861 137.202C144.861 137.202 144.221 135.9 143.86 134.868C142.402 130.693 141.92 123.862 142.646 118.327C143.928 108.754 148.185 102.304 149.957 99.9748C155.245 93.023 161.306 89.2002 166.955 88.538C168.919 88.3079 172.297 88.586 175.232 91.4015C177.994 94.0512 182.867 103.41 172.359 114.719C169.155 118.165 166.306 120.924 159.623 126.442C154.621 130.592 146.82 135.864 145.307 136.878ZM318.664 137.054L318.177 137.379L318.019 136.821L317.469 134.87C315.935 129.43 315.528 123.861 316.26 118.32C317.524 108.782 321.793 102.31 323.569 99.97C328.853 93.0179 334.89 88.9582 340.567 88.5394C340.936 88.5117 341.323 88.4931 341.723 88.4931C344.486 88.4931 346.816 89.4416 348.844 91.3926C351.605 94.0512 356.469 103.424 345.959 114.718C342.751 118.167 339.902 120.927 333.237 126.446C327.744 130.994 318.754 136.994 318.664 137.054Z" />
            </svg>
        </a>`
    
    }
    else if(category == "Graphics") {

        let limit = countThumbLimits(74) * 3;

        //FETCH ALL ROWS USING CATEGORY
        let data = await fetchAllRowsByCategory(table, category)
        if(isStaleTicket(configScroll, ticket)) return;
        
        //APPEND 3 THUMBS STRING
        for(let a = 0; a < data.length; a++) {

            if(data[a] != null) {

                if(count <= limit) {

                    let tag = data[a].tags.split(', ');

                    for(let b = 0; b < tag.length; b++) {

                        if(tag[b].startsWith(keyword.toLowerCase()) || tag[b].includes(keyword.toLowerCase()) || keyword.includes(tag[b].toLowerCase()) || keyword.toLowerCase() == tag[b].toLowerCase()) {
                    
                            count++;

                            if(data[a].type == 'raster graphics') {

                                append += 
                                `<div class="thumbPreviewMini" style="width: 118px; height: 118px;" data-id="${data[a].id}" data-type="${data[a].type}" data-cloudid = "${data[a].index}" data-post="${data[a].post}" data-thumbno="${a}">
                                    <div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                                        <img src="${data[a].thumbs}">
                                    </div>
                                </div>`;
                            }

                            break;
                        }
                    }
                }
                else {

                    break;
                }
            }

            if(append != "") {

                content = 
                `<div class = "wrapEntries">
                    <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">Go back</h2></div></div>
                    <div class="wrapThumbScroller">
                        <div class="wrapThumbImages">
                            ${append}
                        </div>
                    </div>
                </div>`;
            }
        }

        menuFooter.innerHTML = ``
    }
    else {

        let limit = countThumbLimits(74) * 3;

        //FETCH ALL ROWS USING CATEGORY
        let data = await fetchAllRowsByCategory(table, category)
        if(isStaleTicket(configScroll, ticket)) return;
        
        //APPEND 3 THUMBS STRING
        for(let a = 0; a < data.length; a++) {

            if(data[a] != null) {

                if(count <= limit) {

                    let tag = data[a].tags.split(', ');

                    for(let b = 0; b < tag.length; b++) {

                        if(tag[b].startsWith(keyword.toLowerCase()) || tag[b].includes(keyword.toLowerCase())) {
                    
                            count++;

                            if(data[a].type == '3D mockup') {
                
                                append += 
                                `<div class="thumbPreviewMini" data-id="${data[a].id}" data-type="${data[a].type}" data-cloudid = "${data[a].index}" data-artist="${data[a].artist}" data-artisturl="${data[a].artist_url}" data-aspectratio="${data[a].aspect_ratio}" data-modelcolor="${data[a].model_color}" data-thumbno="${a}">
                                    <div class = "hoverPreviewMini">
                                        ${data[a].source}
                                    </div>
                                </div>`;
                            }

                            else {

                                append += 
                                `<div class="thumbPreviewMini" data-id ="${data[a].id}" data-type="${table == "patterns"? "patterns": data[a].type}" data-cloudid = "${data[a].index}" data-post="${table == "patterns"? "center": data[a].post}" data-thumbno="${a}">
                                    <div class = "hoverPreviewMini" style="margin: auto; display: flex;">
                                        ${data[a].source}
                                    </div>
                                </div>`;
                            }

                            break;
                        }
                    }
                }
                else {

                    break;
                }
            }
           
            if(append != "") {

                content = 
                `<div class = "wrapEntries">
                    <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">Go back</h2></div></div>
                    <div class="wrapThumbScroller">
                        <div class="wrapThumbs">
                            ${append}
                        </div>
                    </div>
                </div>`;
            }
        }

        menuFooter.innerHTML = ``
    }

    //THIS FUNCTION WILL REMOVE BACKGROUND
    configScroll.querySelector('.contentCategory').innerHTML = content;

}

function searchPreviewOrCategory() {

    let menu = this.closest(`[id*=menu]`);
    let table = menu.id.replace('menu', '').toLowerCase();
    let txtSearch = menu.querySelector('.txtSearch');
   
    let configScroll = menu.querySelector('.configScroll');
    
    if(configScroll.dataset.content == 'contentPreview') {
        searchContentPreview(configScroll, table, txtSearch.value);
    }
    else if(configScroll.dataset.content == 'contentCategory') {
        //CAUSING ABNORMAL ISSUE BUT IT'S WORKING
        //USE TRY TO HIDE ERROR IF THERE'S ANY
        try {
            let category = configScroll.querySelector('.contentCategory').querySelector('.previewTitle').firstElementChild.innerText;
            searchContentCategory(category, configScroll, table, txtSearch.value);
        }
        catch {}
    }
}

/////////////////////////SEARCHING FOR SUGGESTIONS////////////////////

//SUGGESTIONS ARE LOCAL NOW. THE KEYWORDS COME FROM res/js/obj/libKey*.js, WHICH ARE
//GENERATED FROM THE tags COLUMNS, SO THIS FUNCTION NEVER TOUCHES THE NETWORK AND IS NO
//LONGER async. THAT IS WHAT KILLED THE FLICKER: TYPING "carrot" USED TO FIRE SIX
//fetchAllRowsByCategory CALLS AND A FAST TYPER REACHED Enter WHILE THE LAST ONE WAS
//STILL IN FLIGHT - IT CAME BACK AFTER hideAllOptions() AND REOPENED THE LIST. WITH NO
//AWAIT THERE IS NOTHING LEFT THAT CAN ARRIVE LATE. SUPABASE IS HIT EXACTLY ONCE NOW,
//WHEN THE USER COMMITS, BY chooseSearch BELOW.
function searchSuggestions() {

    //[!] DO NOT USE APPEND
    //JUST ADD TO INNERHTML ALREADY
    //SO CAN CHECK IF SAME KEYWORD EXIST
    //IN THE SAME LOOP

    let drop =  this.parentElement.nextElementSibling;
    let table = this.closest(`[id*=menu]`).id.replace('menu', '').toLowerCase();
    let configScroll = this.closest(`[id*=menu]`).querySelector('.configScroll');
    let value = this.value.trim().toLowerCase();

    //GUARDED. THIS LINE THREW TypeError ON EVERY KEYSTROKE WHENEVER dataset.content DID
    //NOT RESOLVE TO AN ELEMENT HOLDING AN h2, AND BECAUSE IT WAS AWAITED FROM A DOCUMENT
    //LISTENER IT SURFACED AS AN UNHANDLED REJECTION - THE USER SAW NO SUGGESTIONS AND NO
    //REASON WHY. IT FEEDS ONE COMPARISON FURTHER DOWN, NOTHING MORE.
    let previewTitle = configScroll.querySelector(`.${configScroll.dataset.content}`)?.querySelector('h2')?.innerText ?? "";

    //ONE LIST PER MENU. THE VOCABULARIES USED TO BE MERGED, WHICH IS WHY A PATTERN
    //SEARCH OFFERED 'couch' WHEN NO PATTERN CARRIES IT - THE WORD BELONGED TO AN ELEMENT.
    let libs = {
        elements: keyElements,
        patterns: keyPatterns
    };

    let keys = (libs[table] || '').split(',');

    //keyPexels IS THE IMAGE VOCABULARY AND THE IMAGES LIVE IN THE ELEMENTS MENU. IT WAS
    //APPENDED FOR EVERY TABLE, WHICH IS THE SAME BUG AS ABOVE.
    if(table == "elements") keys = keys.concat(keyPexels.split(','));

    drop.innerHTML = "";

    for(let a = 0; a < keys.length; a++) {

        let word = keys[a].trim().toLowerCase();

        if(word == "") continue;

        //PREFIX MATCH, THE WAY THE PEXELS LOOP ALWAYS DID IT. A SUBSTRING MATCH WOULD
        //OFFER 'couch' FOR 'ouch'.
        if(!word.startsWith(value)) continue;

        //THE ELEMENT AND PEXELS LISTS OVERLAP ON WORDS LIKE 'apple'
        if(drop.outerHTML.includes(word)) continue;

        drop.innerHTML +=
        `<div class="optSearch">
            <div class="searchIcon" style="margin-left: 1px; background-color: transparent;">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1919 12.6061A7 7 0 1 1 12.6061 11.1919L16 14.5858L14.5858 16L11.1919 12.6061ZM12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z" fill="white"/>
                    </svg>
            </div>${word}</div>`;
    }

    if(drop.childElementCount == 0) {

        if(table == "elements" && configScroll.dataset.content == "contentPreview" || configScroll.dataset.content == "contentCategory" && previewTitle == "Images") {
            drop.innerHTML =
            `<div class="optSearch">
                <div class="searchIcon" style="margin-left: 0px; background-color: transparent;">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1919 12.6061A7 7 0 1 1 12.6061 11.1919L16 14.5858L14.5858 16L11.1919 12.6061ZM12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z" fill="white"/>
                    </svg>
                </div>${this.value}
            </div>`;
        }
        else {
            drop.innerHTML =
            `<div style="width: 100%; height: 32px; display:flex;">
            <h2 style="color: var(--sharp); font-size: 12px; font-weight: 600; letter-spacing: 1px; margin: auto;">
                No ${table} found
            </h2></div>`;
        }
    }

    if(this.value.trim().length >= 2) {
        drop.style.display = "block";
        isOptionVisible = true;
    }
}

//LOCAL, FOR THE SAME REASON AS searchSuggestions ABOVE. keyTemplates COMES FROM
//res/js/obj/libKeyTemplates.js. fetchTemplatesFromCache HAS NO CALLERS AFTER THIS - IT
//IS LEFT IN PLACE DELIBERATELY, IT IS A WORKING CACHE READER.
function searchTemplateSuggestions() {

    //[!] DO NOT USE APPEND
    //JUST ADD TO INNERHTML ALREADY
    //SO CAN CHECK IF SAME KEYWORD EXIST
    //IN THE SAME LOOP

    let drop =  this.parentElement.nextElementSibling;
    let value = this.value.trim().toLowerCase();

    let keys = keyTemplates.split(',');

    drop.innerHTML = "";

    for(let a = 0; a < keys.length; a++) {

        let word = keys[a].trim().toLowerCase();

        if(word == "") continue;

        if(!word.startsWith(value)) continue;

        if(drop.outerHTML.includes(word)) continue;

        drop.innerHTML +=
        `<div class="optSearch">
            <div class="searchIcon" style="margin-left: 0px; background-color: transparent;">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1919 12.6061A7 7 0 1 1 12.6061 11.1919L16 14.5858L14.5858 16L11.1919 12.6061ZM12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z" fill="white"/>
                    </svg>
            </div>${word}</div>`;
    }

    if(drop.childElementCount == 0) {

        drop.innerHTML =
        `<div class="optSearch">
            <div class="searchIcon" style="margin-left: 1px;">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1919 12.6061A7 7 0 1 1 12.6061 11.1919L16 14.5858L14.5858 16L11.1919 12.6061ZM12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z" fill="white"/>
                    </svg>
            </div>${this.value}
        </div>`;

    }

    if(this.value.trim().length >= 2) {
        drop.style.display = "block";
        isOptionVisible = true;
    }
}

function chooseSearch() {
    let menu = this.closest(`[class*='menu']`);
    let txtSearch = menu.querySelector(`[class*='txtSearch']`)
    txtSearch.value = this.innerText.trim();

    if(txtSearch.className == "txtSearchTemplate") {
        searchContentPreviewTemplates(txtSearch.value);
    }
    else {
        searchPreviewOrCategory.call(this);
    }
    
}

async function fetchImagePreview(search, page) {

    let url;
    let max = 80;

    if(search == "curated") {

        page = Math.floor(Math.random() * 30) + 1;

        url = `https://api.pexels.com/v1/curated?page=${page}&per_page=${max}`;

    }
    else {
        url = `https://api.pexels.com/v1/search?query=${search}&per_page=${max}`;
    }
    
    try {

        let response = await fetch(url, {headers: { Authorization: pexelsAPI}, signal: AbortSignal.timeout(3000)});
        if(!response.ok) return null;
        return await response.json();

    }
    catch {
        return null;
    }


}

async function fetchImageNextPage(url) {

    //[!] PEXELS BUILDS NEXT_PAGE WITH A DOUBLED PATH SEGMENT, api.pexels.com/v1/v1/...
    //WHICH NEVER RESOLVES. COLLAPSE IT BEFORE THE REQUEST GOES OUT
    url = url.replace('/v1/v1/', '/v1/');

    let response = await fetch(url, {headers: { Authorization: pexelsAPI}});
    let json = await response.json();

    return json; 
}

















/////////////////////SWITCHING TO PREVIEW OR CATEGORY//////////////////
function showPreviewOrCategory() {

    let menu = this.closest(`[id*=menu]`);
    let table = menu.id.replace('menu', '').toLowerCase();
    let txtSearch = menu.querySelector('.txtSearch');
    
    let configScroll = menu.querySelector('.configScroll');
    let category = this.parentElement.dataset.category;
    let contentPreview = configScroll.querySelector('.contentPreview');
    let contentCategory = configScroll.querySelector('.contentCategory');

    if(this.innerText == 'View all') {
        configScroll.dataset.content = "contentCategory";
        configScroll.dataset.category = this.dataset.category;
        contentPreview.style.display = "none";
        contentCategory.style.display = "block";
        
        if(txtSearch.value == "") {

            if(contentCategory.firstElementChild == null) {
                dataPexelsCurated = null;
                resetContentCategory(this, configScroll);
            }
            else {

                //A LOAD THAT WAS OVERTAKEN LEAVES ITS FILLERS BEHIND, AND FILLERS HAVE NO TITLE -
                //THAT IS A LIST TO RELOAD, NOT ONE TO KEEP
                let title = contentCategory.querySelector('.previewTitle');

                if(title == null || this.dataset.category != title.firstElementChild.innerText) {
                    dataPexelsCurated = null;
                    resetContentCategory(this, configScroll);
                }
            }
        }

        else {
            dataPexelsCurated = null;
            searchContentCategory(category, configScroll, table, txtSearch.value)
        }
    }
    else {
        configScroll.dataset.content = "contentPreview";
        contentPreview.style.display = "block";
        contentCategory.style.display = "none";

        if(txtSearch.value == "") {
        
            dataPexelsSearched = null;

            if(table == 'patterns') { 
                resetContentPreview(configScroll, table, 9)
            } 
            else {
                resetContentPreview(configScroll, table);
            }
         
        }
        else {

            dataPexelsSearched = null;

            //DO NOT RELOCATE SHOWFILLERS
            //THIS SEQUENCE IS CORRECT
            showFillers(configScroll)
            .then(() => {
                searchContentPreview.call(this, configScroll, table, txtSearch.value);
            })
        }
    }
}

///////////////////////////////RESET///////////////////////////

async function resetPreviewOrCategory() {

    let menu = this.closest(`[id*=menu]`);
    let table = menu.id.replace('menu', '').toLowerCase();
    let configScroll = menu.querySelector('.configScroll');

    //x IS PRESSED WHILE A KEYWORD LOAD IS STILL OUT. THE TICKET RETIRES IT NOW, BEFORE THE
    //await BELOW, SO IT CANNOT LAND ON THE LIST WHILE THE DEFAULT ONE IS BEING FETCHED
    let ticket = takePreviewTicket(configScroll);
    
    let categoryCount = await fetchAllCategory(table);
    if(isStaleTicket(configScroll, ticket)) return;

    let configScrollChild = configScroll.querySelector(`.${configScroll.dataset.content}`).childElementCount;

    if(configScroll.dataset.content == 'contentPreview') {
        
        if(table == "patterns") {

            if(categoryCount.length != configScrollChild) {
                showFillers(configScroll)
            }

            resetContentPreviewPattern();
        }
        else {

            if(categoryCount.length != configScrollChild) {
                showFillers(configScroll)
            }
            
            resetContentPreview(configScroll, table);
        }
    
    }
    else if(configScroll.dataset.content == 'contentCategory') {

        let contentCategory = configScroll.querySelector('.contentCategory');
        let me = contentCategory.querySelector('.btnViewAll');

        resetContentCategory(me, configScroll)
    }

}

async function resetContentPreviewTemplates() {

    let configScroll = document.getElementsByClassName('configScroll')[0];
    let ticket = takePreviewTicket(configScroll);

    await showFillers(configScroll);
    if(isStaleTicket(configScroll, ticket)) return;

    let append = "";
    let content = "";
    //ONE 246 TILE PER ROW, FOUR COVER THE FIRST BATCH (sir, 2026-10-13)
    let limit = 4;

    //FETCH ALL PATTERNS USING CATEGORY
    let data = await fetchLimitedTemplates(limit)
    if(isStaleTicket(configScroll, ticket)) return;

    //APPEND 3 THUMBS STRING
    for(let b = 0; b < data.length; b++) {

        if(data[b] != null) {
    
            append += 
            `<div class="thumbPreviewMini" style="width: 246px; height: 246px;" data-index="${data[b].index}" data-id="${data[b].id}" data-type="${data[b].type}" data-thumbno="${b}">
                <div class = "hoverPreviewMini" style="width: 226px; height: 226px;">
                    <img src = "${data[b].thumbs}" style="width: 100%; height: 100%"> 
                </div>
            </div>`;

        }
    }
            
    if(append != "") {

        //APPEND THE 3 THUMBS INSIDE THE WRAPENTRIES
        content += 
        `<div class = "wrapEntries">
            <div class="wrapThumbs" style="display: grid; grid-template-columns: 1fr;">${append}</div>
        </div>`;
    }

    configScroll.querySelector('.contentPreview').innerHTML = content;
}

async function resetContentPreviewPattern() {

    let configScroll = document.getElementsByClassName('configScroll')[1];
    let ticket = takePreviewTicket(configScroll);

    //FETCH CATEGORIES
    let fetchedCategories = await fetchAllCategory('patterns');
    if(isStaleTicket(configScroll, ticket)) return;
    dataCategory = fetchedCategories;
    
    let menuFooter = configScroll.closest('.menu').querySelector('.menuFooter');
    menuFooter.innerHTML = ``;

    let append = "";
    let count = 0;
    let content = "";

    for(let a = 0; a < dataCategory.length; a++) {
        
        let category = dataCategory[a].category;

        count = 0;
        append = "";
        let limit = 3; //LIMIT 3 THUMBNAILS PER CATEGORY

        //FETCH ALL PATTERNS USING CATEGORY
        let data = await fetchLimitedRowsByCategory('patterns', category, limit);
        if(isStaleTicket(configScroll, ticket)) return;

        //APPEND 3 THUMBS STRING
        for(let b = 0; b < data.length; b++) {

            if(data[b] != null) {

                if(data[b].type == '3D mockup') {
                    if(data[b].feature.toLowerCase() == 'true') {

                        count++;
                        append += 
                        `<div class="thumbPreviewMini" data-id="${data[b].id}" data-type="${data[b].type}" data-cloudid = "${data[b].index}">
                            <div class = "hoverPreviewMini">
                                <img src = "${data[b].thumbs}" style="width: 100%; height: 100%"> 
                            </div>
                        </div>`;

                        if(count == limit) {
                            break;
                        }
                    }
                }
                else {

                    if(category.toLowerCase() == data[b].tags.split(',')[0]) {

                        if(data[b].feature.toLowerCase() == 'true') {
                            
                            count++;
                            append += 
                            `<div class="thumbPreviewMini" data-id ="${data[b].id}" data-type="patterns" data-cloudid = "${data[b].index}" data-post="center">
                                <div class = "hoverPreviewMini" style="margin: auto; display: flex;">
                                    ${data[b].source}
                                </div>
                            </div>`;

                            if(count == limit) {
                                break;
                            }
                        }
                    }
                }
            }
            
        }
        
        if(append != "") {


            //APPEND THE 3 THUMBS INSIDE THE WRAPENTRIES
            content += 
            `<div class = "wrapEntries">
                <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">View all</h2></div></div>
                <div class="wrapThumbs">${append}</div>
            </div>`;
        }
            
    }

    configScroll.querySelector('.contentPreview').innerHTML = content;

}

async function resetContentPreview(configScroll, table) {

    let ticket = takePreviewTicket(configScroll);

    //FETCH CATEGORIES
    
    let fetchedCategories = await fetchAllCategory(table);
    if(isStaleTicket(configScroll, ticket)) return;
    dataCategory = fetchedCategories;

    let menuFooter = configScroll.closest('.menu').querySelector('.menuFooter');
    menuFooter.innerHTML = ``;

    let append = "";
    let count = 0;
    let content = "";

    for(let a = 0; a < dataCategory.length; a++) {
        
        let category = dataCategory[a].category;

        if(category == 'Images') {
        
            append = "";
            let limit = 4; //LIMIT 3 THUMBNAILS PER CATEGORY
            let fetchedPhotos = await fetchImagePreview("curated", 1);
            if(isStaleTicket(configScroll, ticket)) return;
            dataPexelsSearched = null;
            dataPexelsCurated = fetchedPhotos;

            if(dataPexelsCurated == null) {

                //if(append != "") {

                    content += 
                    `<div class = "wrapEntries">
                        <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnRetry"><h2 style="margin:auto;">Retry</h2></div></div>
                        <div style="width: 246px; height: 74px; border: 2px solid var(--muted-track); border-radius: 6px; display: flex; box-sizing: border-box;"><h2 style="margin:auto; font-size: 12px; font-weight: 600px; letter-spacing: 1px;">API Unavailable</h2></div>
                    </div>`;
                //}
            }
            else {

                for(let b = 0; b < limit; b++) {

                    if(dataPexelsCurated.photos[b] != null) {
                        
                        append += 
                        `<div class="thumbPreviewMini" style="width: 118px; height: 118px;" data-type="image" data-cloudid="${dataPexelsCurated.photos[b].id}" data-post="center" data-host="pexels" data-thumbno="${b}" data-photog = "${dataPexelsCurated.photos[b].photographer}" data-photogurl = "${dataPexelsCurated.photos[b].photographer_url}">
                            <div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                                <img src = "${dataPexelsCurated.photos[b].src.medium}">
                            </div>
                        </div>`;
                    }
                }

                if(append != "") {

                    content += 
                    `<div class = "wrapEntries">
                        <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">View all</h2></div></div>
                        <div class="wrapThumbImages">${append}</div>
                    </div>`;
                }
            }
        }

        else if(category == "Graphics") {

            count = 0;
            append = "";
            let limit = 4; //LIMIT 3 THUMBNAILS PER CATEGORY

            //FETCH ALL PATTERNS USING CATEGORY
            let data = await fetchLimitedRowsByCategory(table, category, limit);
            if(isStaleTicket(configScroll, ticket)) return;
            
            data = data.filter(() => true)
            //APPEND 3 THUMBS STRING
            for(let b = 0; b < data.length; b++) {

                if(data[b] != null) {

                    if(data[b].type == 'raster graphics') {
   
                        if(data[b].feature.toLowerCase() == 'true') {
                            count++;
                            append += 
                            `<div class="thumbPreviewMini" style="width: 118px; height: 118px;" data-id="${data[b].id}" data-type="${data[b].type}" data-cloudid ="${data[b].index}" data-post="${data[b].post}">
                                <div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                                    <img src="${data[b].thumbs}">
                                </div>
                            </div>`;
                        }
                    }
                }
            }
            
            if(append != "") {

                //APPEND THE 3 THUMBS INSIDE THE WRAPENTRIES
                content += 
                `<div class = "wrapEntries">
                    <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">View all</h2></div></div>
                    <div class="wrapThumbImages">${append}</div>
                </div>`;
    
            }

        }

        else {

            count = 0;
            append = "";
            let limit = 3; //LIMIT 3 THUMBNAILS PER CATEGORY

            //FETCH ALL PATTERNS USING CATEGORY
            let data = await fetchLimitedRowsByCategory(table, category, limit);
            if(isStaleTicket(configScroll, ticket)) return;

            //APPEND 3 THUMBS STRING
            for(let b = 0; b < data.length; b++) {

                if(data[b] != null) {

                    if(data[b].type == '3D mockup') {
                        if(data[b].feature.toLowerCase() == 'true') {

                            count++;
                            append += 
                            `<div class="thumbPreviewMini" data-id="${data[b].id}" data-type="${data[b].type}" data-cloudid = "${data[b].index}" data-artist="${data[b].artist}" data-artisturl="${data[b].artist_url}" data-aspectratio="${data[b].aspect_ratio}" data-modelcolor="${data[b].model_color}">
                                <div class = "hoverPreviewMini">
                                    ${data[b].source}
                                </div>
                            </div>`;

                            if(count == limit) {
                                break;
                            }
                        }
                    }
                    else if(data[b].type == "icon") {

                        if(category.toLowerCase() == data[b].tags.split(',')[0]) {

                            if(data[b].feature.toLowerCase() == 'true') {
                                
                                count++;
                                append += 
                                `<div class="thumbPreviewMini" data-id ="${data[b].id}" data-type="${data[b].type}" data-cloudid = "${data[b].index}" data-post="${data[b].post}" data-thumbno="${b}" data-source="${encodeURIComponent(data[b].source)}">
                                    <div class = "hoverPreviewMini" style="margin: auto; display: flex;">
                                        <img src="${data[b].thumbs}">
                                    </div>
                                </div>`;

                                if(count == limit) {
                                    break;
                                }
                            }
                        }
                    }
                    else {

                        if(category.toLowerCase() == data[b].tags.split(',')[0]) {

                            if(data[b].feature.toLowerCase() == 'true') {
                                
                                count++;
                                append += 
                                `<div class="thumbPreviewMini" data-id ="${data[b].id}" data-type="${table == "patterns"? "patterns": data[b].type}" data-cloudid = "${data[b].index}" data-post="${table == "patterns"? "center": data[b].post}">
                                    <div class = "hoverPreviewMini" style="margin: auto; display: flex;">
                                        ${data[b].source}
                                    </div>
                                </div>`;

                                if(count == limit) {
                                    break;
                                }
                            }
                        }
                    }
                }
                
            }
            
            if(append != "") {

                //APPEND THE 3 THUMBS INSIDE THE WRAPENTRIES
                content += 
                `<div class = "wrapEntries">
                    <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">View all</h2></div></div>
                    <div class="wrapThumbs">${append}</div>
                </div>`;
            }

        }
            
    }

    configScroll.querySelector('.contentPreview').innerHTML = content;
    
}

async function resetContentCategory(me, configScroll) {

    let ticket = takePreviewTicket(configScroll);

    //DO NOT RELOCATE SHOWFILLERS
    //THIS SEQUENCE IS CORRECT
    await showFillers(configScroll);
    if(isStaleTicket(configScroll, ticket)) return;

    let contentCategory = configScroll.querySelector('.contentCategory');
    let category = me?.parentElement?.dataset.category;
    let menuFooter = configScroll.closest('.menu').querySelector('.menuFooter');

    if(category == null || category == undefined) {
        category = me?.parentElement?.querySelector('h2')?.innerText;
    }

    //x PRESSED WHILE THIS LIST WAS STILL ON FILLERS: THERE IS NO Go back BUTTON TO READ, SO THE
    //CATEGORY COMES FROM WHERE View all RECORDED IT
    if(category == null || category == undefined) {
        category = configScroll.dataset.category;
    }

    let table = configScroll.closest(`[id*='menu']`).id.replace('menu', '').toLowerCase();
   
    let append = "";

    if(category == "Images") {

        let fetchedPhotos = await fetchImagePreview('curated', 1);
        if(isStaleTicket(configScroll, ticket)) return;
        dataPexelsSearched = null;
        dataPexelsCurated = fetchedPhotos;

        let limit = countThumbLimits(118) * 2 //2 PER ROW
        
        for(let a = 0; a < limit; a++) {

            append += 
            `<div class="thumbPreviewMini" style="width: 118px; height: 118px;" data-type="image" data-cloudid = "${dataPexelsCurated.photos[a].id}" data-post="center" data-host="pexels" data-thumbno="${a}" data-photog = "${dataPexelsCurated.photos[a].photographer}" data-photogurl = "${dataPexelsCurated.photos[a].photographer_url}">
                <div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                    <img src = "${dataPexelsCurated.photos[a].src.medium}">
                </div>
            </div>`;
        }

        contentCategory.innerHTML = 
        `<div class = "wrapEntries">
            <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">Go back</h2></div></div>
                <div class="wrapThumbScroller">
                    <div class="wrapThumbImages">
                        ${append}
                    </div>
                </div>
            </div>
        </div>`;

        menuFooter.innerHTML = 
        `<a href = "https://pexels.com" target="blank" style="width: 100px; height: 20px; margin: auto; display: flex; text-decoration: none;">
            <p style="color: var(--sharp); white-space: nowrap; margin: auto; font-weight: 100; font-size: 10px; letter-spacing: 1px;">More on</p>
            <?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <svg xmlns="http://www.w3.org/2000/svg" width="85" height="38" viewBox="0 0 512 227" style="margin: auto; width:100%; height: 100%; cursor: pointer">
                <path fill="white" d="M511.187 131.02C509.164 120.486 506.384 114.524 503.211 107.417C501.187 102.884 499.317 98.6027 498.694 95.7914C497.152 88.8342 497.908 80.1165 498.265 76.9559H479.596L476.451 81.9607C469.281 93.3721 453.608 118.338 453.607 118.339C444.924 131.386 434.121 147.618 418.553 153.758C415.613 154.751 409.393 156.767 404.469 151.122C399.777 145.744 400.185 139.937 400.204 139.692L400.223 139.433L400.235 139.275L400.351 139.165L400.543 138.982C421.115 119.456 440.747 98.0267 450.557 84.3877C461.856 68.6797 467.522 55.7517 471.946 44.8671C474.701 38.0835 480.429 21.0609 474.129 9.53638C471.495 4.71716 467.034 1.44608 461.567 0.325525C460.497 0.106481 459.471 0 458.432 0C446.837 0 433.098 14.565 416.43 44.5274C402.557 69.4604 392.695 90.8751 387.12 108.177C384.235 117.129 382.339 128.47 382.339 128.471C381.714 129.595 370.375 142.671 359.178 150.087C355.43 152.569 349.908 155.638 342.002 155.638C334.841 155.638 328.199 151.258 328.197 151.257C328.2 151.256 339.703 145.052 358.243 126.848C368.262 117.009 372.497 103.566 369.295 91.7638C364.27 73.2637 346.588 71.826 341.288 71.826C326.515 71.8713 314.504 81.4527 308.708 89.6434C294.733 109.381 295.344 125.544 297.439 137.419C298.118 141.257 299.355 145.038 301.115 148.654L301.29 149.012C301.288 149.013 279.271 164.432 266.053 146.596C260.98 139.75 253.158 125.537 253.157 125.534L299.238 76.9613H274.472C258.72 93.2817 243.999 108.701 243.996 108.704C243.995 108.701 233.145 87.9123 227.999 76.9559H207.991C209.743 80.4129 211.508 83.9821 213.435 87.8768C219.788 100.719 230.978 122.349 230.979 122.351C230.978 122.353 226.203 127.339 226.202 127.341C223.675 129.967 215.982 137.958 203.609 145.553C196.697 149.788 189.441 152.685 181.427 154.409C175.157 155.759 167.083 155.908 162.222 154.604C159.442 153.858 154.206 151.303 154.206 151.303C154.208 151.301 168.684 142.237 184.317 126.858C194.327 117.011 198.563 103.568 195.371 91.7732C190.344 73.2768 172.662 71.8395 167.362 71.8395C152.593 71.8845 140.578 81.4614 134.777 89.6491C120.804 109.375 121.416 125.547 123.511 137.432C124.127 140.925 126.491 147.497 126.491 147.497C115.785 153.142 105.638 156.512 93.2508 156.956C92.1763 156.995 87.5926 157.012 86.1204 156.934C85.7569 156.915 84.623 156.763 84.623 156.763C84.6237 156.763 87.2107 155.105 87.8157 154.692C103.092 144.267 109.834 125.528 110.298 108.996C110.682 95.3566 107.46 84.338 101.226 77.974C97.3124 73.9742 92.1345 71.9054 85.8352 71.826H85.5688C74.4682 71.826 61.8243 78.4821 53.018 86.7525C50.955 88.6901 45.1151 95.26 45.1149 95.2603L48.7384 76.9532H29.566L0 226.271H19.1834L36.48 138.885C40.2234 122.447 45.9629 112.029 56.9644 101.665L57.1455 101.51C59.8693 99.1994 62.9849 97.0036 65.918 95.328C70.7655 92.5572 75.1511 91.152 78.9529 91.152C81.208 91.152 83.2428 91.6543 85.0023 92.6447C91.2279 96.1683 91.9858 104.727 92.3933 109.326C93.9896 127.445 80.0006 139.727 78.4002 141.068C73.7991 144.917 68.9992 146.788 63.7256 146.788C56.6649 146.788 51.3729 144.284 48.4039 142.896C48.2907 143.445 47.5469 147.095 47.5469 147.095C46.8113 150.765 45.389 158.138 45.3888 158.139C53.0786 164.721 68.412 172.104 88.6396 173.266C90.28 173.362 91.9431 173.41 93.5821 173.41C108.447 173.41 123.012 169.522 136.873 161.854L137.135 161.71L137.36 161.904C142.623 166.436 147.692 168.647 149.358 169.373C159.042 173.596 169.583 173.335 170.617 173.335C183.411 173.335 195.361 169.647 198.718 168.517C219.995 161.354 232.065 147.959 236.609 142.977L240.074 139.324L242.274 143.381C245.181 148.764 248.476 154.865 254.285 161.506C256.697 164.264 265.809 173.26 281.817 173.26C297.013 173.26 312.644 162.989 312.645 162.988C312.648 162.991 317.775 167.024 323.309 169.632C330.243 172.899 338.323 173.252 341.475 173.252C357.227 173.252 370.233 167.39 383.645 154.243L384.105 153.792C384.106 153.794 386.055 158.429 387.734 160.845C396.363 173.254 407.477 173.294 411.374 173.294C414.976 173.294 421.025 172.67 425.577 170.911C445.916 163.047 461.71 141.167 469.314 128.825C469.315 128.823 475.112 119.634 481.964 105.539L483.494 102.455C483.495 102.456 487.147 111.122 487.148 111.125C489.25 116.226 491.21 121.908 492.143 125.6C494.718 135.576 496.443 144.345 491.431 150.591C488.987 153.607 483.95 156.851 478.666 156.851C475.899 156.851 473.29 155.986 470.912 154.279C470.011 153.616 469.077 152.78 468.125 151.79C464.24 156.638 460.211 161.063 456.139 164.956C459.638 167.489 467.811 173.453 480.048 173.453C483.773 173.453 489.075 172.493 492.539 170.772C506.635 163.769 514.679 149.203 511.187 131.02ZM408.648 103.39L410.031 99.942C415.213 87.0267 422.71 71.8007 432.95 53.394C444.791 32.107 452.665 23.6148 456.304 20.4475L457.405 19.4904L458.066 18.9154L458.107 19.782L458.176 21.2241C458.376 25.5125 456.987 31.7896 454.461 38.0155C450.253 48.3681 445.298 59.6522 435.181 73.718C430.12 80.7499 421.854 90.4729 411.905 101.095L409.353 103.823L407.815 105.467L408.648 103.39ZM145.307 136.878L144.861 137.202C144.861 137.202 144.221 135.9 143.86 134.868C142.402 130.693 141.92 123.862 142.646 118.327C143.928 108.754 148.185 102.304 149.957 99.9748C155.245 93.023 161.306 89.2002 166.955 88.538C168.919 88.3079 172.297 88.586 175.232 91.4015C177.994 94.0512 182.867 103.41 172.359 114.719C169.155 118.165 166.306 120.924 159.623 126.442C154.621 130.592 146.82 135.864 145.307 136.878ZM318.664 137.054L318.177 137.379L318.019 136.821L317.469 134.87C315.935 129.43 315.528 123.861 316.26 118.32C317.524 108.782 321.793 102.31 323.569 99.97C328.853 93.0179 334.89 88.9582 340.567 88.5394C340.936 88.5117 341.323 88.4931 341.723 88.4931C344.486 88.4931 346.816 89.4416 348.844 91.3926C351.605 94.0512 356.469 103.424 345.959 114.718C342.751 118.167 339.902 120.927 333.237 126.446C327.744 130.994 318.754 136.994 318.664 137.054Z" />
            </svg>
        </a>`       
    }
    else if(category == "Graphics") {

        let data = await fetchAllRowsByCategory(table, category);
        if(isStaleTicket(configScroll, ticket)) return;

        let limit = countThumbLimits(118) * 2 //2 PER ROW

        data = data.filter(() => true);

        dataCategory = data;

        for(let a = 0; a < limit; a++) {

            if(data[a] != null) {
                
                if(data[a].type == 'raster graphics') {
                    append += 
                    `<div class="thumbPreviewMini" style="width: 118px; height: 118px;" data-id="${data[a].id}" data-type="${data[a].type}" data-cloudid = "${data[a].index}" data-post="${data[a].post}" data-thumbno="${a}">
                        <div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                            <img src="${data[a].thumbs}">
                        </div>
                    </div>`;
                }   
            }
        }

        contentCategory.innerHTML = 
        `<div class="wrapEntries">
            <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">Go back</h2></div></div>
            <div class="wrapThumbScroller">
                <div class="wrapThumbImages">
                    ${append}
                </div>
            </div>
        </div>
        </div>`;

        menuFooter.innerHTML = ``;
    }
    else {

        let data = await fetchAllRowsByCategory(table, category);
        if(isStaleTicket(configScroll, ticket)) return;

        dataCategory = data;

        let limit = countThumbLimits(74) * 3 //3 PER ROW

        for(let a = 0; a < limit; a++) {

            if(data[a] != null) {

                if(data[a].type == '3D mockup') {

                    append += 
                    `<div class="thumbPreviewMini" data-id="${data[a].id}" data-type="${data[a].type}" data-cloudid = "${data[a].index}" data-artist="${data[a].artist}" data-artisturl="${data[a].artist_url}" data-aspectratio="${data[a].aspect_ratio}" data-modelcolor="${data[a].model_color}" >
                        <div class = "hoverPreviewMini">
                            ${data[a].source}
                        </div>
                    </div>`;
                }
                else if(data[a].type == 'icon') {
                    if(data[a].tags.includes(category.toLowerCase())) {

                        append += 
                        `<div class="thumbPreviewMini" data-id="${data[a].id}" data-type="${data[a].type}" data-cloudid = "${data[a].index}" data-post="${data[a].post}" data-thumbno="${a}" data-source="${encodeURIComponent(data[a].source)}">
                            <div class = "hoverPreviewMini" style="display: flex; margin: auto;">
                                <img src= "${data[a].thumbs}">
                            </div>
                        </div>`;
                    }
                }
                else {

                    if(data[a].tags.includes(category.toLowerCase())) {

                        append += 
                        `<div class="thumbPreviewMini" data-id="${data[a].id}" data-type="${table == "patterns"? "patterns": data[a].type}" data-cloudid = "${data[a].index}" data-post="${table == "patterns"? "center": data[a].post}" data-thumbno="${a}">
                            <div class = "hoverPreviewMini" style="display: flex; margin: auto;">
                                ${decodeURIComponent(data[a].source)}
                            </div>
                        </div>`;
                    }
                }   
            }
        }

        contentCategory.innerHTML = 
        `<div class = "wrapEntries">
            <div class="previewTitle"><h2 style="color: var(--sharp); letter-spacing: 1px;">${category}</h2><div class="btnViewAll" data-category="${category}"><h2 style="margin:auto;">Go back</h2></div></div>
                <div class="wrapThumbScroller">
                    <div class="wrapThumbs">
                        ${append}
                    </div>
                </div>
            </div>
        </div>`;

        menuFooter.innerHTML = ``;
    }

}

/////////////////////LOAD ENTRIES OPT AND ADDING EVENTS//////////////////

async function checkLoadedEntries(wrapEntries, count) {

    if(wrapEntries != null || wrapEntries != undefined) {

        let thumbPreview = wrapEntries.querySelectorAll(`[class*='thumbPreview']`);

        for(let a = 0; a < count; a++) {
            //AWAIT IF THUMBNAIL HAS LOADED
            if(thumbPreview[a] != null) {
                await thumbPreview[a].firstElementChild.firstElementChild;
                thumbPreview[a].style.display = "flex";
            }
        }
    }
}

/////////////////////SHOW FILLERS FOR PATTERN OR ELEMENTS////////////////

async function showFillers(configScroll) {
   
    let content = configScroll.dataset.content;

    maxEntries = Math.ceil(configScroll.clientHeight / 133); //109px for wrapEntries + 1.5em margin
    
    configScroll.querySelector(`.${content}`).innerHTML = '';

    //CREATE REAL FILLERS
    let div = document.createElement('div');
    div.classList.add('configScrollFiller');
    configScroll.querySelector(`.${content}`).append(div);

    for(let a = 0; a < maxEntries; a++) { 
        //ADD WRAP FILLERS
        configScroll.querySelector(`.configScrollFiller`).innerHTML += 
        `<div class="wrapFiller">
            <svg class="fillerAnts" viewBox="0 0 246 109" width="246" height="109" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="244" height="107" rx="6" pathLength="700"
                    fill="none" stroke="var(--muted-track)" stroke-width="2" stroke-dasharray="6 2">
                    <animate attributeName="stroke-dashoffset"
                            from="14" to="0" dur="0.5s" repeatCount="indefinite"/>
                </rect>
            </svg>
        </div>`
    }
}

async function showWrapEntries(configScroll, maxEntries) {

    let content = configScroll.dataset.content;

    maxEntries? maxEntries = maxEntries: maxEntries = Math.ceil(configScroll.clientHeight / 133); //109px for wrapEntries + 1.5em margin
    
    configScroll.querySelector(`.${content}`).innerHTML = '';

    for(let a = 0; a < maxEntries; a++) { 
        configScroll.querySelector(`.${content}`).innerHTML += `<div class="wrapEntries"></div>`
    }
}


////////////////////COUNT LIMITS PER THUMBNAIL SIZE//////////////
function countThumbLimits(size) {
    /*
    let headerUIHeight = 32 + 1; //BORDER BOTTOM 1PX
    let pnldropheaderHeight = 70 + 1; //BREAKLINE 1PX
    let menuFooterHeight = 69;
    let previewTitleHeight = 40;
    */
    //let wrapHeight = window.innerHeight - headerUIHeight - pnldropheaderHeight - menuFooterHeight - previewTitleHeight;

    let thumbPreviewHeight = size + 8; //WRAPTHUMB MIN HEIGHT + 8 GAP;
    let limit = Math.round(window.innerHeight / thumbPreviewHeight);

    if(limit % 2 == 1) {
        limit++
    }

    return limit;
}












/////////////////////////////LAZY LOADING FOR PATTERNS AND ELEMENTS/////////////////////////
async function categoryLazyLoad() {
    
    ////////////THIS WORKS DIFFERENTLY FROM FONTLAZY LOADER/////////////////
    let dataLength;
    let maxEntries;
    let wrapper;

    let configScroll = this.closest('.configScroll');
    let contentCategory = configScroll.querySelector('.contentCategory');
    let thumbPreviewMini = contentCategory.querySelectorAll('.thumbPreviewMini');
    let category = contentCategory.querySelector('.previewTitle').firstElementChild.innerText;

    //ADJUST MAX ENTRIES DEPENDING ON THUMBNAIL SIZES
    //SET PAGELIMIT TOO DEPENDING ON DATA LENGTH
    //WRAPPER CHOICE DEPENDS ON CATEGORY
    if(category == "Images") {
        //REASSIGN DATA CATEGORY EITHER DATAPEXELSCURATED OR DATEPEXELSSEARCHED
        dataPexelsCurated? dataCategory = dataPexelsCurated: dataCategory = dataPexelsSearched;
        dataPexelsCurated? dataLength = dataPexelsCurated.photos.length: dataLength = dataPexelsSearched.photos.length;
        maxEntries = 3 * 2;
        pageLimit = 80;
        wrapper = contentCategory.querySelector('.wrapThumbImages');
    }
    else if(category == "Graphics") {
        dataLength = dataCategory.length;
        maxEntries = 3 * 2;
        pageLimit = dataLength;
        wrapper = contentCategory.querySelector('.wrapThumbImages');
    }
    else {

        dataLength = dataCategory.length;
        maxEntries = 4 * 3; 
        pageLimit = dataLength;
        wrapper = contentCategory.querySelector('.wrapThumbs');
    }

    //SCROLLING TO BOTTOM AND RELOADING FUTURE NEW CONTENT
    if(this.scrollTop == (this.scrollHeight - this.offsetHeight)) {

        let count = 0;
        let i = Number(this.firstElementChild.lastElementChild.dataset.thumbno);

        if(category == "Images") {

            if(Math.abs(i - dataCategory.photos.length) > maxEntries) {

                for(let a = 0; a < maxEntries; a++) { 

                    this.firstElementChild.innerHTML += 
                    `<div class="thumbPreviewMini" style="width: 118px; height: 118px;" data-type="image" data-cloudid = "${dataCategory.photos[a + i + 1].id}" data-post="center" data-host="pexels" data-thumbno="${a + i + 1}" data-photog = "${dataCategory.photos[a + i + 1].photographer}" data-photogurl = "${dataCategory.photos[a + i + 1].photographer_url}">
                        <div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                            <img src="${dataCategory.photos[a + i + 1].src.medium}">
                        </div>
                    </div>`;
                }
            
            }
            else {

                //NOT A NEW TICKET - THIS ONLY EXTENDS THE LIST THAT IS ON SCREEN. IF A RESET OR A
                //SEARCH TOOK THE LIST WHILE THE PAGE WAS OUT, THE PAGE BELONGS TO NOTHING
                let ticket = previewTickets.get(configScroll);
                let nextURL = dataCategory.next_page;
                let newPage = await fetchImageNextPage(nextURL);

                if(isStaleTicket(configScroll, ticket)) return;
                let oldPhotos = dataCategory.photos;
                let newPhotos = newPage.photos;

                let mergePhotos = [...oldPhotos, ...newPhotos];
                newPage.photos = mergePhotos;

                dataPexelsCurated? dataPexelsCurated = newPage: dataPexelsSearched = newPage;
                //FORCE CALL THE FUNCTION AGAIN TO TRIGGER
                //SINCE SCROLL EVENT WILL STOP WHEN LAST SCROLLED TO BOTTOM
                categoryLazyLoad.call(this);
            }
        }
        else if(category == "Graphics") {
            
            for(let a = 0; a < maxEntries; a++) { 

                if(dataCategory[a + i + 1] != null) {

                    this.firstElementChild.innerHTML += 
                    `<div class="thumbPreviewMini" style="width: 118px; height: 118px;" data-type="${dataCategory[a + i + 1].type}" data-id="${dataCategory[a + i + 1].id}" data-cloudid = "${dataCategory[a + i + 1].index}" data-post="${dataCategory[a + i + 1].post}" data-thumbno="${a + i + 1}">
                        <div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                            <img src="${dataCategory[a + i + 1].thumbs}">
                        </div>
                    </div>`;
                }
            }
     
        }
        else {

            for(let a = 0; a < maxEntries; a++) { 

                if(dataCategory[a + i + 1] != null) {

                    this.firstElementChild.innerHTML += 
                    `<div class="thumbPreviewMini" data-type="${dataCategory[a + i + 1].type}" data-id="${dataCategory[a + i + 1].id}" data-cloudid = "${dataCategory[a + i + 1].index}" data-post="${dataCategory[a + i + 1].post}" data-thumbno="${a + i + 1}">
                        <div class = "hoverPreviewMini">
                            ${dataCategory[a + i + 1].source}
                        </div>
                    </div>`;

                }
            }
            
        }
        
        lazyThumbsDeleteUp.call(this);
    }

    //SCROLLING TOP OR BOTTOM WITH PREVIOUSLY LOADED THUMBS
    else { 
        
        if(category == "Images") {

            for(let a = 0; a < thumbPreviewMini.length; a++) {

                //SHOW THUMB CONTENT FROM ABOVE AND BELOW IF IT'S INSIDE THE WINDOW SIZE IN FRAME
                if(thumbPreviewMini[a].getBoundingClientRect().top > 0 && thumbPreviewMini[a].getBoundingClientRect().bottom < window.innerHeight && thumbPreviewMini[a].firstElementChild == null) {

                    let thumbno = Number(thumbPreviewMini[a].dataset.thumbno);

                    thumbPreviewMini[a].innerHTML = 
                    `<div class = "hoverPreviewMini" style="width: 98px; height: 98px;"></div>`;

                    let img = document.createElement('img');
                    img.src = dataCategory.photos[thumbno].src.medium;
                    img.style.visibility = "hidden";

                    img.onload = () => {

                        thumbPreviewMini[a].firstElementChild.appendChild(img);
                        thumbPreviewMini[a].querySelector('img').style.visibility = "visible";
                    }

                }
            }
        }

        else if(category == "Graphics") {

            for(let a = 0; a < thumbPreviewMini.length; a++) {

                //SHOW THUMB CONTENT FROM ABOVE AND BELOW IF IT'S INSIDE THE WINDOW SIZE IN FRAME
                if(thumbPreviewMini[a].getBoundingClientRect().top > 0 && thumbPreviewMini[a].getBoundingClientRect().bottom < window.innerHeight && thumbPreviewMini[a].firstElementChild == null) {

                    let thumbno = Number(thumbPreviewMini[a].dataset.thumbno);

                    thumbPreviewMini[a].innerHTML = 
                    `<div class = "hoverPreviewMini" style="width: 98px; height: 98px;">
                        <img src="${dataCategory[thumbno].thumbs}">
                    </div>`;
                }
            }
        }
        else {

            for(let a = 0; a < thumbPreviewMini.length; a++) {

                //SHOW THUMB CONTENT FROM ABOVE AND BELOW IF IT'S INSIDE THE WINDOW SIZE IN FRAME
                if(thumbPreviewMini[a].getBoundingClientRect().top > 0 && thumbPreviewMini[a].getBoundingClientRect().bottom < window.innerHeight && thumbPreviewMini[a].firstElementChild == null) {

                    let thumbno = Number(thumbPreviewMini[a].dataset.thumbno);
                    let source = dataCategory[thumbno].source
                    //let id = thumbPreviewMini[a].dataset.id; 
              
                    //let data = await fetchRowById('patterns', id);
                    //let source = decodeURIComponent(data[0].source);

                    thumbPreviewMini[a].innerHTML = 
                    `<div class = "hoverPreviewMini">
                        ${decodeURIComponent(source)}
                    </div>`;
                }
               
            }
        }
        
        lazyThumbsDeleteDown.call(this); 
    }

}

//////////////////////////////LAZY REMOVE EXCESS FONTS///////////////////////

function lazyThumbsDeleteUp() {
    
    let thumb = this.querySelectorAll('.thumbPreviewMini');

    for(let a = 0; a < thumb.length; a++) {

        if(thumb[a].firstElementChild != null) {
        
            if(thumb[a].getBoundingClientRect().bottom < 0) {
                
                thumb[a].firstElementChild?.remove();
            }
        }
    }
}

function lazyThumbsDeleteDown() {

    let thumb = this.querySelectorAll('.thumbPreviewMini');
    let i = Number(this.firstElementChild.firstElementChild.dataset.thumbno);

    for(let a = 0; a < thumb.length; a++) {

        if(thumb[a].firstElementChild != null) {
        
            if(thumb[a].getBoundingClientRect().top > window.innerHeight) {
                
                thumb[a].firstElementChild?.remove();
            }
        }
    }
    
}





















////////////////////////////SEARCH FONT//////////////////////////

async function searchFontSuggestions() {

    let keyword = this.value;
    let drop =  this.parentElement.nextElementSibling;

    drop.innerHTML = "";

    let keys = fontKeywords.split(', ');

    for(let a = 0; a < keys.length; a++) {

        let split = keys[a].split('-');
        let splitName = split[0].split(' ');
        let splitClass = split[1];
        
        for(let b = 0; b < splitName.length; b++) {

            if(splitName[b].trim().startsWith(this.value)) {
                
                if(!drop.outerHTML.includes(keys[a])) {
                    
                    drop.innerHTML += 
                    `<div class="optSearchFont" data-class="${splitClass}">
                        <div class="searchIcon" style="margin-left: 1px; background-color: transparent;">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1919 12.6061A7 7 0 1 1 12.6061 11.1919L16 14.5858L14.5858 16L11.1919 12.6061ZM12 7C12 9.76142 9.76142 12 7 12C4.23858 12 2 9.76142 2 7C2 4.23858 4.23858 2 7 2C9.76142 2 12 4.23858 12 7Z" fill="white"/>
                            </svg>
                        </div>
                        ${split[0]}
                    </div>`;
                    break;
                }
            }
        }
        
    }


    if(drop.childElementCount == 0) {
        drop.innerHTML = 
        `<div style="width: 100%; height: 32px; display:flex;">
        <h2 style="color: var(--sharp); font-size: 12px; font-weight: 600; letter-spacing: 1px; margin: auto;">
            No fonts found
        </h2></div>`;
    }
    
    drop.style.display = "block";
    isOptionVisible = true;

}

async function chooseFontSearch() {

    //ADD FONT IN THE HEAD IF NOT YET
    //FETCH FROM SUPABASE
    let font = this.innerText.trim();
    let fontClass = this.dataset.class;
    let data = await fetchFontsByTag(fontClass, font);

    let fontCase;
    if(data[0].tags.includes('cursive')) fontCase = "Capitalize";
    else fontCase = "UpperCase";

    ///////////ADD DATASETS FROM DATA RESULT
    this.dataset.font = data[0].name;
    this.dataset.case = fontCase;
    this.dataset.source = encodeURIComponent(data[0].source);

    if(!document.head.innerHTML.includes(this.dataset.source)) {
        document.head.insertAdjacentHTML('beforeend', this.dataset.source);
    }

    if(swapMode == "font") swapFontOnTargets(this.dataset.font, this.dataset.class, this.dataset.source);
    else createPnlBoxText.call(this); 

    let menu = this.closest(`[class*='menu']`);
    menu.querySelector('.txtSearchFont').value = "";
    menu.querySelector('.btnDelSearch').style.visibility = 'hidden';
    
}

//////////////////////////SHOW FONT FILLERS///////////////////////

async function showFontFillers(configScroll, tab) {

    let maxEntries = Math.round(configScroll.clientHeight / 66) + 1; //50px for wrapFonts + 1em margin

    tab.innerHTML = '';

    for(let a = 0; a < maxEntries; a++) { 
        tab.innerHTML += `<div class="wrapFonts" data-cloudid ='${a}'></div>`;
    }
}

async function lazyFontFillers(tab, maxEntries, direction) {

    if(direction == "down") {
        let i = Number(tab.lastElementChild.dataset.cloudid);
        for(let a = 0; a < maxEntries; a++) { 

            tab.insertAdjacentHTML('beforeend', `<div class="wrapFonts" data-cloudid = '${i + 1 + a}' data-thumbno = '${i + 1 + a}'></div>`)
        }
    }
    else if(direction == "up") {
        let i = Number(tab.firstElementChild.dataset.cloudid);
        for(let a = 0; a < maxEntries; a++) { 

            tab.insertAdjacentHTML('afterbegin', `<div class="wrapFonts" style="background-color: transparent;" data-cloudid = '${i - 1 - a}' data-thumbno = '${i - 1 - a}'></div>`)
        }
    }
}














///////////////////////////////////////CACHE API/////////////////////////////////////

//THIS WILL STORE THE DATA FROM SUPABASE TO THE CACHE API
//TABLE IS STRING FORMAT AS 'res_serif'
//KEY IS URL FORMAT OF THE RETURNED DATA EXCEPT THE SOURCE
//SINCE THE SOURCE IS USUALLY VERY LONG AND ALSO A URL FORMAT
//KEY IS FORMATTED AS SUPABASE TABLE COLUMN AS: index/name/class/normal/italics/designers/tags

//THE VALUE IS THE ACTUAL SOURCE AS: <link href='https://fonts.googleapis.com/css2?family=ABeeZee:ital@0;1&display=swap' rel='stylesheet' crossorigin>
async function storeFontsToCache(table, data) {
        
    //DELETE IF THERE'S EXISTING TABLE
    //await caches.delete(table)
    //OPEN OR CREATE MAIN FOLDER CACHE
    let cache = await caches.open('res_font_' + table);

    for(let a = 0; a < data.length; a++) {
        //MAKE A STRING FOR KEY
        let key = "";
        key += data[a].index + '/';
        key += data[a].name + '/';
        key += data[a].class + '/';
        key += data[a].normal + '/';
        key += data[a].italics + '/';
        key += data[a].designers + '/';
        key += data[a].tags + '/';

        //MAKE A STRING FOR SOURCE
        let value = encodeURIComponent(data[a].source);

        //CREATE NEW RESPONSE CONSTRUCTOR (VALUE)
        //THIS WILL SIMULATE FETCH AND RESPONSE
        //SINCE CACHE API SIMULATE KEYS AS HTTP URL REQUEST
        //AND THE KEY OR VALUE MUST SIMULATE A RESPONSE
        let newValue = new Response(value);
        await cache.put(key, newValue);
    }
    
}

async function fetchFontFromCache(cache, keys, font) {

    //DECLARE DATA VARIABLE
    let data = {};
    //await caches.delete(table)
    //PROCESS EVERY KEYS IN THE GIVEN CACHE
    for(let a = 0; a < keys.length; a++) {
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');
        //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE
        //GET A RAW FORMAT STRING
        keys[a] = decodeURIComponent(keys[a]);

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');

        //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
        //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
        let response = await cache.match(keys[a]);
        //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
        //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
        let source = await response.text();

        //REAL INDEX USE INSTEAD OF [a]

        if(values[2] == font) {
            //let i = Number(values[1]);
            data.index = Number(values[1]);
            data.name = values[2];
            data.class = values[3];
            data.normal = values[4];
            data.italics = values[5];
            data.designers = values[6];
            data.tags = values[7];
            data.source = decodeURIComponent(source);
            return data;
        }
        
    }
    
}

async function fetchFontsByTagFromCache(cache, keys, keyword) {

    //DECLARE DATA VARIABLE
    let i = 0;
    let data = [];
    keyword = keyword.toLowerCase();
    let keywords = keyword.split(' ');

    //await caches.delete(table)
    //PROCESS EVERY KEYS IN THE GIVEN CACHE
    for(let a = 0; a < keys.length; a++) {
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');
        //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE
        //GET A RAW FORMAT STRING
        keys[a] = decodeURIComponent(keys[a]);

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');

        //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
        //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
        let response = await cache.match(keys[a]);
        //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
        //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
        let source = await response.text();

        for(let b = 0; b < keywords.length; b++) {

            if(keywords[b].trim() != "") {

                let splitName = values[2].toLowerCase().split(' ');
                //if(values[7].toLowerCase().includes(keywords[b]) || values[7].toLowerCase().startsWith(keywords[b])) {
                
                for(let c = 0; c < splitName.length; c++) {

                    if(splitName[c].startsWith(keyword)) {
                        //REAL INDEX USE INSTEAD OF [a]
                        //let i = Number(values[1]);
                        data[i] = {};
                        data[i].index = Number(values[1]);
                        data[i].name = values[2];
                        data[i].class = values[3];
                        data[i].normal = values[4];
                        data[i].italics = values[5];
                        data[i].designers = values[6];
                        data[i].tags = values[7];
                        data[i].source = decodeURIComponent(source);
                        i++;
                        break;
                    }
                }
            }   
        }
    }
    return data;
    
}

async function fetchLimitedFontsFromCache(cache, keys, start, limit) {

    //DECLARE DATA VARIABLE
    let data = [];
    
    //await caches.delete(table)
    //PROCESS EVERY KEYS IN THE GIVEN CACHE
    for(let a = 0; a < keys.length; a++) {
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');
        //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE
        //GET A RAW FORMAT STRING
        keys[a] = decodeURIComponent(keys[a]);

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');

        //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
        //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
        let response = await cache.match(keys[a]);
        //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
        //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
        let source = await response.text();

        //REAL INDEX USE INSTEAD OF [a]
        let i = Number(values[1]);

        data[i] = {};
        data[i].index = Number(values[1]);
        data[i].name = values[2];
        data[i].class = values[3];
        data[i].normal = values[4];
        data[i].italics = values[5];
        data[i].designers = values[6];
        data[i].tags = values[7];
        data[i].source = decodeURIComponent(source);
    }

    //CHECK IF START TO LIMIT IS NOT NULL
    //IF ONLY SINGLE KEY FROM START TO FINISH IS NULL,
    //RETURN NULL SO IT WILL FETCH FROM SUPABASE
    //IF ALL COMPLETE THEN RETURN DATA
    let newData = [];

    //FILTER ONLY START AND <= LIMIT
    //TRANSFER TO NEWDATA
    for(let a = start; a <= limit; a++) {
        if(data[a]) {
            newData[a] = data[a]
        }
        else {
            return null;
        }
    }

    return newData;
}


//////////////CACHE API CATEGORY//////////////

async function storeCategoryToCache(table, data) {
        
    //DELETE IF THERE'S EXISTING TABLE
    //await caches.delete(table)
    //OPEN OR CREATE MAIN FOLDER CACHE
    let cache = await caches.open(`res_${table.toLowerCase()}_category`);
    for(let a = 0; a < data.length; a++) {
        //MAKE A STRING FOR KEY
        let key = "";
        key += data[a].index + '/';
        key += data[a].category + '/';
    
        //MAKE A STRING FOR SOURCE
        let value = "";

        //CREATE NEW RESPONSE CONSTRUCTOR (VALUE)
        //THIS WILL SIMULATE FETCH AND RESPONSE
        //SINCE CACHE API SIMULATE KEYS AS HTTP URL REQUEST
        //AND THE KEY OR VALUE MUST SIMULATE A RESPONSE
        let newValue = new Response(value);
        await cache.put(key, newValue);
    }

}

async function storeResourcesToCache(table, data) {

    //DELETE IF THERE'S EXISTING TABLE
    //await caches.delete(table)
    //OPEN OR CREATE MAIN FOLDER CACHE
    let cache = await caches.open(`res_${table.toLowerCase()}`);

    if(table == "templates") {

        for(let a = 0; a < data.length; a++) {

            //THE THUMBNAIL LIVES BESIDE THE .wdr IN THE BUCKET NOW INSTEAD OF IN A COLUMN,
            //SO THE ROW ARRIVES WITHOUT thumbs. FILLING THE SAME PROPERTY FROM THE BUCKET
            //KEEPS EVERYTHING DOWNSTREAM EXACTLY AS IT WAS - THE KEY FORMAT, THE THREE
            //CACHE READERS AND EVERY <img src="${data.thumbs}"> SITE ARE ALL UNTOUCHED.
            //fetchLimitedTemplates RETURNS THIS SAME ARRAY, SO THIS ASSIGNMENT IS WHAT THE
            //RENDER READS ON A COLD CACHE AND THE KEY IS WHAT IT READS ON A WARM ONE.
            let { data: png } = await wondrSupabase.storage
            .from('templates')
            .download(data[a].id + '/thumbnail.png');

            //A DATA URL, NOT AN OBJECT URL - IT HAS TO SURVIVE INSIDE A CACHE KEY AND
            //ACROSS RELOADS, WHICH A blob: URL DOES NOT. AND "" RATHER THAN LEAVING IT
            //UNSET: encodeURIComponent(undefined) WOULD BAKE THE LITERAL STRING
            //"undefined" INTO THE KEY AND INTO THE src.
            data[a].thumbs = png == null? "": await new Promise(done => {
                let reader = new FileReader();
                reader.onload = () => done(reader.result);
                reader.readAsDataURL(png);
            });

            //MAKE A STRING FOR KEY
            let key = "";
            key += data[a].index + '/';
            key += data[a].id + '/';
            key += data[a].tags + '/';
            key += encodeURIComponent(data[a].thumbs) + '/';
            key += encodeURIComponent(data[a].aspect_ratio) + '/';
            key += data[a].type + '/';
        
            //THE templates BUCKET IS PRIVATE NOW
            //.download() SENDS THE SESSION JWT SO THERE IS NO TOKEN AND NO EXPIRATION
            let value = "";
            let { data: wdr } = await wondrSupabase.storage
            .from('templates')
            .download(data[a].id + '/' + data[a].id + '.wdr');

            if(wdr) value = await wdr.text();

            //[!] NEVER CACHE AN EMPTY VALUE, IT POISONS THE KEY UNTIL THE CACHE IS CLEARED
            if(value == null || value == "") continue;
   
            //CREATE NEW RESPONSE CONSTRUCTOR (VALUE)
            //THIS WILL SIMULATE FETCH AND RESPONSE
            //SINCE CACHE API SIMULATE KEYS AS HTTP URL REQUEST
            //AND THE KEY OR VALUE MUST SIMULATE A RESPONSE
            let newValue = new Response(value);
            await cache.put(key, newValue);
        }
    }
    else if(table == "patterns") {

        for(let a = 0; a < data.length; a++) {
            //MAKE A STRING FOR KEY
            let key = "";
            key += data[a].index + '/';
            key += data[a].id + '/';
            key += data[a].tags + '/';
            key += data[a].feature + '/';
        
            //MAKE A STRING FOR SOURCE
            let value = encodeURIComponent(data[a].source);

            //CREATE NEW RESPONSE CONSTRUCTOR (VALUE)
            //THIS WILL SIMULATE FETCH AND RESPONSE
            //SINCE CACHE API SIMULATE KEYS AS HTTP URL REQUEST
            //AND THE KEY OR VALUE MUST SIMULATE A RESPONSE
            let newValue = new Response(value);
            await cache.put(key, newValue);
        }
    }

    else if(table == "elements") {
        for(let a = 0; a < data.length; a++) {
            //MAKE A STRING FOR KEY
            let key = "";
            key += data[a].index + '/';
            key += data[a].id + '/';
            key += data[a].post + '/';
            key += data[a].type + '/';
            key += data[a].tags + '/';
            key += data[a].feature + '/';
            
            //MAKE A STRING FOR SOURCE
            let value;

            if(data[a].type.includes('3D')) {
                key += encodeURIComponent(decodeURIComponent(data[a].source)) + '/';
                key += encodeURIComponent(data[a].artist) + '/';
                key += encodeURIComponent(data[a].artist_url) + '/';
                key += encodeURIComponent(data[a].aspect_ratio) + '/';
                key += encodeURIComponent(data[a].model_color) + '/';
                //THIS IS THE EXTENDED KEY ONLY FOR 3D
                //SINCE SOURCE IS THE THUMBNAIL PREVIEW AND THE RESPONSE IS THE ACTUAL GLTF
                //ENCODE THE SOURCE AND DECODE IN

                //THE MODEL BUCKETS ARE PRIVATE NOW
                //.download() SENDS THE SESSION JWT SO THERE IS NO TOKEN AND NO EXPIRATION
                let newType = data[a].type.toLowerCase().replaceAll(' ', '-');
                let { data: glb } = await wondrSupabase.storage
                .from(newType + '-models')
                .download(data[a].id + '/main.glb');

                //NEVER CACHE A FAILED DOWNLOAD, A 400 BODY WOULD POISON THE KEY
                if(!glb) continue;
                value = glb;
            }
            else {
                key += encodeURIComponent(data[a].thumbs) + '/';
                value = encodeURIComponent(data[a].source);
            }
            

            //CREATE NEW RESPONSE CONSTRUCTOR (VALUE)
            //THIS WILL SIMULATE FETCH AND RESPONSE
            //SINCE CACHE API SIMULATE KEYS AS HTTP URL REQUEST
            //AND THE KEY OR VALUE MUST SIMULATE A RESPONSE
            let newValue = new Response(value);
            await cache.put(key, newValue);
        }
    }
    
}

async function fetchAllCategoryFromCache(keys) {
    //DECLARE DATA VARIABLE
    let data = [];

    //PROCESS EVERY KEYS IN THE GIVEN CACHE
    for(let a = 0; a < keys.length; a++) {
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');
        //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE
        //GET A RAW FORMAT STRING
        keys[a] = decodeURIComponent(keys[a]);

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');

        //REAL INDEX USE INSTEAD OF [a]
        let i = Number(values[1]);

        data[i] = {};
        data[i].index = Number(values[1]);
        data[i].category = values[2];
        
    }

    data = data.filter(() => true);
    return data;
}

async function fetchLimitedCategoryFromCache(keys, start, limit) {
    //DECLARE DATA VARIABLE
    let data = [];

    //PROCESS EVERY KEYS IN THE GIVEN CACHE
    for(let a = 0; a < keys.length; a++) {
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');
        //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE
        //GET A RAW FORMAT STRING
        keys[a] = decodeURIComponent(keys[a]);

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');

        //REAL INDEX USE INSTEAD OF [a]
        let i = Number(values[1]);

        data[i] = {};
        data[i].index = Number(values[1]);
        data[i].category = values[2];
        
    }

    //CHECK IF START TO LIMIT IS NOT NULL
    //IF ONLY SINGLE KEY FROM START TO FINISH IS NULL,
    //RETURN NULL SO IT WILL FETCH FROM SUPABASE
    //IF ALL COMPLETE THEN RETURN DATA
    let newData = [];

    //FILTER ONLY START AND <= LIMIT
    //TRANSFER TO NEWDATA
    for(let a = start; a <= limit; a++) {
        if(data[a]) {
            newData[a] = data[a]
        }
        else {
            return null;
        }
    }
    return newData;
}

async function fetchLimitedRowsByCategoryFromCache(table, category, limit) {

    //CACHE IS THE LOCAL FOLDER PATH OF TABLE
    let cache = await caches.open(`res_${table.toLowerCase()}`);
    //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
    let keys = await cache.keys();

    category = category.toLowerCase();

    if(table == "patterns") {

        //let i = 0;
        let data = [];
        let count = 0;

        //PROCESS EVERY KEYS IN THE GIVEN CACHE
        for(let a = 0; a < keys.length; a++) {
            //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
            //REMOVING 127.0.0.1/ OR createwondr.com/ PART
            keys[a] = keys[a].url.replace(window.location.origin, '');
            //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE
            //GET A RAW FORMAT STRING
            keys[a] = decodeURIComponent(keys[a]);

            //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
            let values = keys[a].split('/');
      
            //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
            //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
            let response = await cache.match(keys[a]);
            //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
            //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
            let source = await response.text();
           
            //USE VALUES[3] SINCE IT'S STRING DATA TAGS

            if(values[3].toLowerCase().includes(category) && values[4] == "true") {

                //REAL INDEX USE INSTEAD OF [a]
                let i = Number(values[1]);
                data[i] = {};
                data[i].index = Number(values[1]);
                data[i].id = values[2];
                data[i].tags = values[3];
                data[i].feature = values[4];

                data[i].source = decodeURIComponent(source);
                
                count++;

                if(count == limit) {
                    break;
                }
            }
            
        }

        data = data.filter(() => true);
        return data;

    }
    else if(table == "elements") {

        //let i = 0;
        let data = [];
        let count = 0;

        //PROCESS EVERY KEYS IN THE GIVEN CACHE
        for(let a = keys.length - 1; a >= 0; a--) {
            //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
            //REMOVING 127.0.0.1/ OR createwondr.com/ PART
            keys[a] = keys[a].url.replace(window.location.origin, '');
            //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE
            //GET A RAW FORMAT STRING
            //keys[a] = decodeURIComponent(keys[a]);

            //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
            let values = keys[a].split('/');

            //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
            //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
            
            //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
            //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
            //let categories = category.split(' ');

            //for(let b = 0; b < categories.length; b++) {

                //USE VALUES[7] SINCE IT'S STRING DATA TAGS
                if(values[5].toLowerCase().includes(category) && values[6] == "true") {
                    
                    //REAL INDEX USE INSTEAD OF [a]
                    let i = Number(values[1]);

                    //[!] ONE ROW CAN HOLD TWO KEYS WHEN A WRITER CHANGES THE KEY LAYOUT.
                    //COUNTING THOSE TWICE SPENDS THE LIMIT AND DROPS THE OLDEST ROW
                    if(data[i] != null) continue;

                    data[i] = {};
                    data[i].index = Number(values[1]);
                    data[i].id = decodeURIComponent(values[2]);
                    data[i].post = values[3];
                    data[i].type = decodeURIComponent(values[4]);
                    data[i].tags = decodeURIComponent(values[5]);
                    data[i].feature = values[6];
                    data[i].thumbs = decodeURIComponent(values[7]);

                    if(data[i].type.includes('3D')) {
                        data[i].artist = decodeURIComponent(values[8]);
                        data[i].artist_url = decodeURIComponent(values[9]);
                        data[i].aspect_ratio = decodeURIComponent(values[10]);
                        data[i].model_color = decodeURIComponent(values[11]);

                        let response = await cache.match(keys[a]);
                        let source = await response.blob();
                        data[i].source = source;
                    }

                    else {
                        let response = await cache.match(keys[a]);
                        let source = await response.text();
                        data[i].source = decodeURIComponent(source); 
                    }

                    count++;

                    if(count == limit) {
                        break;
                    }

                }
            //}
            
        }

        data = data.filter(() => true);
        return data;

    }
}

async function fetchAllRowsByCategoryFromCache(table, category) {
    
    category = category.toLowerCase();
    
    let cache = await caches.open('res_' + table);

    let keys = await cache.keys();

    let categories = category.split(',');

    if(table == "patterns") {

        let data = [];

        //let i = 0;
        //PROCESS EVERY KEYS IN THE GIVEN CACHE
        for(let a = 0; a < keys.length; a++) {
            //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
            //REMOVING 127.0.0.1/ OR createwondr.com/ PART
            keys[a] = keys[a].url.replace(window.location.origin, '');
            //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE
            //GET A RAW FORMAT STRING
            keys[a] = decodeURIComponent(keys[a]);

            //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
            let values = keys[a].split('/');
            
            //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
            //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
            let response = await cache.match(keys[a]);
            //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
            //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
            let source = await response.text();

            //AFTER SPLITTING VALUES, VALUES[3] IS THE TAG STRING
            for(let b = 0; b < categories.length; b++) {

                if(categories[b].trim() != "") {

                    if(values[3].toLowerCase().includes(categories[b]) || values[3].toLowerCase().startsWith(categories[b])) {
                        //REAL INDEX USE INSTEAD OF [a]
                        let i = Number(values[1]);
                        data[i] = {};
                        data[i].index = Number(values[1]);
                        data[i].id = values[2];
                        data[i].tags = values[3];
                        data[i].feature = values[4];

                        data[i].source = decodeURIComponent(source);

                        //i++;
                    }
                }
            }
        }

        //NOTE THAT THIS WILL RETURN DATA ARRAY BUT 
        //WITH SOME INDICES AS DATA[i] SKIPS DEPENDS ON TAG MATCHES
        //EX. DATA[0] = EMPTY, DATA[1] = EMPTY, BUT DATA[2] = 'HEART' AS IT MATCHES
        //DONT WORRY IN SUCCEEDING FUNCTIONS EVERY DATA IS VALIDATED IF NULL TO AVOID ERRORS
        return data;
    }
    else if(table == "elements") {

        //let i = 0;
        let data = [];

        //PROCESS EVERY KEYS IN THE GIVEN CACHE
        for(let a = 0; a < keys.length; a++) {
            //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
            //REMOVING 127.0.0.1/ OR createwondr.com/ PART
            keys[a] = keys[a].url.replace(window.location.origin, '');

            //[!] DO NOT DECODE THE URICOMPONENT YET
            //3D EXTENDED KEY WILL USE AND WILL BE REMOVE AFTER SPLIT
            //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
            let values = keys[a].split('/');

            //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
            //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
            let response = await cache.match(keys[a]);
            //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
            //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
            
            //AFTER SPLITTING VALUES, VALUES[7] IS THE TAG STRING
            if(values[5].toLowerCase().includes(category) || values[5].toLowerCase().startsWith(category)) {
                //REAL INDEX USE INSTEAD OF [a]
                let i = Number(values[1]);

                //MAKE DATA[i] OBJECT
                data[i] = {};
                data[i].index = Number(values[1]);
                data[i].id = decodeURIComponent(values[2]);
                data[i].post = values[3];
                data[i].type = decodeURIComponent(values[4]);
                data[i].tags = decodeURIComponent(values[5]);
                data[i].feature = values[6];
                data[i].thumbs = decodeURIComponent(values[7]);

                if(data[i].type.includes('3D')) {
                    data[i].artist = decodeURIComponent(values[8]);
                    data[i].artist_url = decodeURIComponent(values[9]);
                    data[i].aspect_ratio = decodeURIComponent(values[10]);
                    data[i].model_color = decodeURIComponent(values[11]);

                    let source = await response.blob();
                    data[i].source = source;
                }
                else {
                    let source = await response.text();
                    data[i].source = decodeURIComponent(source); 
                }

                //i++;
            }
        }
        
        //NOTE THAT THIS WILL RETURN DATA ARRAY BUT 
        //WITH SOME INDICES AS DATA[i] SKIPS DEPENDS ON TAG MATCHES
        //EX. DATA[0] = EMPTY, DATA[1] = EMPTY, BUT DATA[2] = 'HEART' AS IT MATCHES
        //DONT WORRY IN SUCCEEDING FUNCTIONS EVERY DATA IS VALIDATED IF NULL TO AVOID ERRORS
        return data;   
    }
}

async function fetchRowByIdFromCache(table, id) {

    let data;   
    id = id.toLowerCase();

    if(table == "patterns") {
        
        let cache = await caches.open('res_patterns');

        //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
        let keys = await cache.keys();

        //PROCESS EVERY KEYS IN THE GIVEN CACHE
        for(let a = 0; a < keys.length; a++) {
            //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
            //REMOVING 127.0.0.1/ OR createwondr.com/ PART
            keys[a] = keys[a].url.replace(window.location.origin, '');
            //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE
            //GET A RAW FORMAT STRING
            keys[a] = decodeURIComponent(keys[a]);

            //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
            let values = keys[a].split('/');
        
            //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
            //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
            let response = await cache.match(keys[a]);
            //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
            //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
            let source = await response.text();

            //AFTER SPLITTING VALUES, VALUES[2] IS THE ID STRING
            if(values[2].toLowerCase() == id || values[2].toLowerCase().startsWith(id)) {
                //REAL INDEX USE INSTEAD OF [a]
        
                data = {};
                data.index = Number(values[1]);
                data.id = values[2];
                data.tags = values[3];
                data.feature = values[4];

                data.source = decodeURIComponent(source);
            }
        }

    }
    else if(table == "elements") {

        let cache = await caches.open('res_elements');

        //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
        let keys = await cache.keys();

        //PROCESS EVERY KEYS IN THE GIVEN CACHE
        for(let a = 0; a < keys.length; a++) {
            //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
            //REMOVING 127.0.0.1/ OR createwondr.com/ PART
            keys[a] = keys[a].url.replace(window.location.origin, '');

            //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE
            //GET A RAW FORMAT STRING
            //keys[a] = decodeURIComponent(keys[a]);

            //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
            let values = keys[a].split('/');

            //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
            //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
            let response = await cache.match(keys[a]);
            //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
            //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
            
            values[2] = decodeURIComponent(values[2]);

            //AFTER SPLITTING VALUES, VALUES[2] IS THE ID STRING
            if(values[2].toLowerCase() == id || values[2].toLowerCase().startsWith(id)) {
                //REAL INDEX USE INSTEAD OF [a]
                let i = Number(values[1]);

                //MAKE DATA[i] OBJECT
                data = {};
                data.index = Number(values[1]);
                data.id = values[2];
                data.post = values[3];
                data.type = decodeURIComponent(values[4]);
                data.tags = decodeURIComponent(values[5]);
                data.feature = values[6];
                data.thumbs = decodeURIComponent(values[7]);

                if(data.type.includes('3D')) {

                    data.artist = decodeURIComponent(values[8]);
                    data.artist_url = decodeURIComponent(values[9]);
                    data.aspect_ratio = decodeURIComponent(values[10]);
                    data.model_color = decodeURIComponent(values[11]);

                    let source = await response.blob();
                    data.source = source;
                }
                else {
                    let source = await response.text();
                    data.source = decodeURIComponent(source);
                }

                break;
            }
        }
        
    }

    return data;
}

async function fetchLimitedTemplatesFromCache(limit) {

    //CACHE IS THE LOCAL FOLDER PATH OF TABLE
    let cache = await caches.open(`res_templates`);
    //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
    let keys = await cache.keys();

    let data = [];
    let count = 0;

    //PROCESS EVERY KEYS IN THE GIVEN CACHE
    for(let a = 0; a < keys.length; a++) {
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');
    
        //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
        //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
        let response = await cache.match(keys[a]);
        //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
        //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
        let source = await response.text();
        
        //REAL INDEX USE INSTEAD OF [a]
        let i = Number(values[1]);
        data[i] = {};
        data[i].index = Number(values[1]);
        data[i].id = decodeURIComponent(values[2]);
        data[i].tags = decodeURIComponent(values[3]);
        data[i].thumbs = decodeURIComponent(values[4]);
        data[i].aspect_ratio = decodeURIComponent(values[5]);
        data[i].type = values[6];
        data[i].source = source;
        
        count++;

        if(count == limit) {
            break;
        }
        
    }

    data = data.filter(() => true);
    data = data.reverse();
    return data;

}

async function fetchTemplatesFromCache(keyword) {

    //CACHE IS THE LOCAL FOLDER PATH OF TABLE
    let cache = await caches.open(`res_templates`);
    //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
    let keys = await cache.keys();

    let data = [];

    //PROCESS EVERY KEYS IN THE GIVEN CACHE
    for(let a = 0; a < keys.length; a++) {
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');
    
        //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
        //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
        let response = await cache.match(keys[a]);
        //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
        //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
        let source = await response.text();
        
        let tags = decodeURIComponent(values[3]).split(', ');

        for(let b = 0; b < tags.length; b++) {

            if(tags[b].toLowerCase().includes(keyword) || tags[b].toLowerCase().startsWith(keyword)) {
         
                let i = Number(values[1]);
                data[i] = {};
                data[i].index = Number(values[1]);
                data[i].id = decodeURIComponent(values[2]);
                data[i].tags = decodeURIComponent(values[3]);
                data[i].thumbs = decodeURIComponent(values[4]);
                data[i].aspect_ratio = decodeURIComponent(values[5]);
                data[i].type = values[6];
                data[i].source = source;
            }
        }
    }

    data = data.filter(() => true);
    data = data.reverse();
    return data;

}

async function fetchTemplateFromCacheByIndex(index) {

    let data;   

    let cache = await caches.open('res_templates');

    //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
    let keys = await cache.keys();

    //PROCESS EVERY KEYS IN THE GIVEN CACHE
    for(let a = 0; a < keys.length; a++) {
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');
        
        //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
        //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
        let response = await cache.match(keys[a]);
        //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
        //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
        let source = await response.text();

        //AFTER SPLITTING VALUES, VALUES[2] IS THE ID STRING
        if(values[1].toLowerCase() == index) {
            //REAL INDEX USE INSTEAD OF [a]
            data = {};
            data.index = Number(values[1]);
            data.id = values[2];
            data.tags = values[3];
            data.thumbs = decodeURIComponent(values[4]);
            data.aspect_ratio = decodeURIComponent(values[5]);
            data.type = values[6];
            data.source = source;

            let file = await verifyWondrFile(data.source);

            if(file == null) return;

            resetProject();

            await loadWondrFile(file);
            clearAutosave();
            hideLoading();
        }
    }

    
}
/////////////////CACHE API FOR 3D ENVIRONMENT//////////////////
async function countAllEnvironments() {

    let {data} = await wondrSupabase
    .schema('wondr')
    .from(`res_environments`)
    .select()
    .order('index', { ascending: true })

    for(let a = 0; a < data.length; a++) {
       
        await fetchEnvironmentAndCubeMapsFromCache(data[a]);
        
    }
    
    return data.length;
    
}
//countAllEnvironments() is now called from auth2.0.js after login so it never runs unauthenticated



//THE RESOURCE BUCKETS ARE PRIVATE NOW SO THE STORED PUBLIC URL CANNOT BE FETCHED
//SPLIT IT BACK INTO BUCKET AND PATH FOR .download(), WHICH SENDS THE SESSION JWT
//THE COLUMN VALUE IS UNTOUCHED SO EVERY EXISTING CACHE KEY STAYS VALID
function bucketPath(url) {
    let parts = url.split('/object/public/')[1].split('/').map(decodeURIComponent);
    return { bucket: parts.shift(), path: parts.join('/') };
}

async function storeEnvironmentAndCubeMapsToCache(data) {
    
    //DELETE IF THERE'S EXISTING TABLE
    //await caches.delete(table)
    //OPEN OR CREATE MAIN FOLDER CACHE
    let cache = await caches.open(`res_environments`);
    let file = ["_nx", "_ny", "_nz", "_px" , "_py" , "_pz"];

    let cubemap = bucketPath(data.cubemap_url);
    let environment = bucketPath(data.env_url);

    //MAKE A STRING FOR SOURCE
    let value = []

    for(let b = 0; b < 7; b++) {

        //MAKE A STRING FOR KEY
        let key = "";

        //UNTIL B IS 0-5 (6 COUNTS) THEN SAVE CUBEMAP AS VALUE
        //ELSE, SAVE ENV URL AS VALUE ON THE 6TH
        if(b < 6) { 
            key += data.index + '/';
            key += encodeURIComponent(data.id) + '/';
            key += encodeURIComponent(data.cubemap_url) + '/';
            key += data.default_rotation + '/';
            key += file[b];

            let { data: jpg } = await wondrSupabase.storage
            .from(cubemap.bucket)
            .download(`${cubemap.path}${file[b]}.jpg`);

            //NEVER CACHE A FAILED DOWNLOAD, fetchCubemapsFromCache COUNTS 6 AND NEVER RETRIES
            if(!jpg) return;
            value[b] = new Response(jpg);
        }
        else {

            key += data.index + '/';
            key += encodeURIComponent(data.id) + '/';
            key += encodeURIComponent(data.env_url) + '/';

            //GET THE RAW BLOB
            let { data: blob } = await wondrSupabase.storage
            .from(environment.bucket)
            .download(environment.path);

            //NEVER CACHE A FAILED DOWNLOAD, THE KEY WOULD RESOLVE TO A GARBAGE .env
            if(!blob) return;
            //TO PRESERVE .ENV, MAKE A FILE OUT OF THIS BLOB
            //let file = new File([blob], "file.env", { type: "application/octet-stream" });
            //let blobURL = URL.createObjectURL(file);
            value[b] = new Response(blob);
        }
        
        //BOTH BRANCHES ALREADY WRAPPED THE DOWNLOADED BLOB IN A RESPONSE
        await cache.put(key, value[b]);
    }
}

//YYYYMMDD, THE FRESHNESS SEGMENT OF THE recovered_autosave KEY. LOCAL DATE, NOT UTC,
//AND THAT IS DELIBERATE: THIS STAMP IS NEVER COMPARED WITH A SERVER DATE, IT ONLY
//ASKS "IS THIS COPY FROM THE SAME DAY THE PERSON IS LOOKING AT IT". credits_reset_on
//IN SQL IS UTC BECAUSE POSTGRES DECIDES THAT ONE - DO NOT MAKE THEM MATCH, THEY ARE
//ANSWERING DIFFERENT QUESTIONS.
function dateStampWondr() {

    let date = new Date();

    return date.getFullYear().toString()
         + String(date.getMonth() + 1).padStart(2, '0')
         + String(date.getDate()).padStart(2, '0');
}

//THE RECOVERED AUTOSAVE. NOT A SHARED RESOURCE LIKE EVERYTHING ELSE IN THIS FILE -
//IT IS ONE PERSON'S OWN DESIGN, HANDED BACK BY
//wondr-downgrade-to-free-autosave-encrypt-download AFTER THEIR SUBSCRIPTION LAPSED.
//
//IT IS CACHED FOR ONE REASON: EVERY CALL OF THAT EDGE FUNCTION COSTS US, AND THE
//MODAL DELIBERATELY STAYS OPEN AFTER A DOWNLOAD - SO A SECOND CLICK IS EXPECTED,
//WHETHER MISREMEMBERED, MIS-CLICKED OR DELIBERATE.
//
//    recovered_autosave  >  uid  >  YYYYMMDD  >  title     VALUE IS THE .wdr STRING
//
//uid SITS IN THE KEY BECAUSE ONE BROWSER PROFILE CAN SEE TWO WONDR ACCOUNTS - A
//SHARED OFFICE MACHINE, A FAMILY PC - AND A KEY WITHOUT IT WOULD HAND THE SECOND
//PERSON THE FIRST PERSON'S DESIGN.
//
//THE DATE IS WHAT STOPS THIS CACHE FROM LYING. WITHOUT IT THE COPY NEVER EXPIRES:
//SOMEBODY LAPSES IN SEPTEMBER, DOWNLOADS, RESUBSCRIBES, WORKS FOR A MONTH, LAPSES
//AGAIN IN OCTOBER - AND THE MODAL HANDS THEM THE SEPTEMBER FILE, SILENTLY, LOOKING
//EXACTLY LIKE SUCCESS. A DAY IS THE RIGHT GRAIN BECAUSE A LAPSED MEMBER CANNOT
//AUTOSAVE AT ALL - THE STORAGE POLICY REFUSES THEM - SO THE SERVER COPY ONLY MOVES
//IF THEY RESUBSCRIBE, WORK AND LAPSE AGAIN, WHICH CANNOT HAPPEN TWICE IN ONE DAY
//WITHOUT THEM KNOWING EXACTLY WHAT THEY ARE DOING.
async function storeRecoveredFreeAutosave(uid, title, file) {

    //SAME RULE AS storeResourcesToCache: AN EMPTY VALUE POISONS THE KEY UNTIL THE
    //CACHE IS CLEARED, AND HERE IT WOULD HAND BACK AN EMPTY .wdr FOREVER.
    if(uid == null || file == null || file == "") return;

    //THE WHOLE FOLDER GOES, NOT JUST THIS ACCOUNT'S ROW. THIS FUNCTION IS ONLY EVER
    //REACHED ON THE PATH THAT ALREADY DECIDED TO CALL THE EDGE FUNCTION, SO ANYTHING
    //STILL IN THERE IS EITHER STALE OR SOMEBODY ELSE'S. WIPING IT KEEPS THE FOLDER AT
    //EXACTLY ONE ROW FOR THE LIFE OF THE BROWSER INSTEAD OF COLLECTING ABANDONED
    //ACCOUNTS THAT NEVER COME BACK, AND IT IS ALSO WHAT RETIRES YESTERDAY'S KEY -
    //THE DATE SEGMENT MEANS A NEW DAY WRITES A NEW KEY RATHER THAN OVERWRITING.
    await caches.delete('recovered_autosave');

    //OPEN OR CREATE MAIN FOLDER CACHE
    let cache = await caches.open('recovered_autosave');

    //MAKE A STRING FOR KEY
    //encodeURIComponent ON THE TITLE, AND "" WHEN IT IS MISSING - THE LITERAL STRING
    //"null" WOULD OTHERWISE BE BAKED INTO THE KEY AND COME BACK AS THE FILENAME.
    let key = "";
    key += uid + '/';
    key += dateStampWondr() + '/';
    key += encodeURIComponent(title || "") + '/';

    //CREATE NEW RESPONSE CONSTRUCTOR (VALUE)
    //THIS WILL SIMULATE FETCH AND RESPONSE
    //SINCE CACHE API SIMULATE KEYS AS HTTP URL REQUEST
    //AND THE KEY OR VALUE MUST SIMULATE A RESPONSE
    let newValue = new Response(file);
    await cache.put(key, newValue);
}

async function fetchEnvironmentAndCubeMaps(globalEnv) {

    let {data} = await wondrSupabase
    .schema('wondr')
    .from(`res_environments`)
    .select()
    .eq('id', globalEnv)
    
    //QUERY FAILED OR NO ROW, NOTHING TO STORE
    if(data == null || data.length == 0) return null;

    //STORE ALL DATA
    await storeEnvironmentAndCubeMapsToCache(data[0]);
    return data;
}

async function fetchCubemapsFromCache(globalEnv) {

    //i IS THE INDEX OF NEW DATA
    //EVERY DATA WILL BE PASSED ON NEW DATA BUT WITH PROPER INCREMENT FROM 0
    let i = 0;
    let newData = [];

    //IF CACHE EXIST, THEN COUNT THE KEYS
    //MUST MATCH THE VALUE COUNT AS PER REQUEST
    
    //CACHE IS THE LOCAL FOLDER PATH OF TABLE
    let cache = await caches.open('res_environments');

    //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
    let keys = await cache.keys();
    
    for(let a = 0; a < keys.length; a++) {
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');
        //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');
        
        //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
        //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
        let response = await cache.match(keys[a]);
        //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
        //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
        let blob = await response.blob();
    
        //[!] NEED TO DECODE INDIVIDUALLY
        //CAN'T ENCODE THE ENTIRE KEY STRING
        
        if(!keys[a].includes('.env')) {

            if(decodeURIComponent(values[2]) == globalEnv) {

                let data = {};

                data.index = Number(values[1]);
                data.id = decodeURIComponent(values[2]);
                data.cubemap_url = decodeURIComponent(values[3]);
                data.default_rotation = Number(values[4]);

                data.source = blob;
                newData[i] = data;
                i++;
            }
        }
    }
    
    if(newData.length == 6) {
        return newData;
    }
    else {
        await fetchEnvironmentAndCubeMaps(globalEnv)
        return null;        
    }
}

async function fetchEnvironmentFromCache(globalEnv) {

    let data = null;

    //CACHE IS THE LOCAL FOLDER PATH OF TABLE
    let cache = await caches.open('res_environments');

    //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
    let keys = await cache.keys(); 

    for(let a = 0; a < keys.length; a++) {
       
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');
        //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');

        //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
        //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
        let response = await cache.match(keys[a]);
        //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
        //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
        let blob = await response.blob();

        //[!] NEED TO DECODE INDIVIDUALLY
        //CAN'T ENCODE THE ENTIRE KEY STRING
        if(keys[a].includes('.env')) {

            if(decodeURIComponent(values[2]) == globalEnv) {

                data = {};

                data.index = Number(values[1]);
                data.id = decodeURIComponent(values[2]);
                data.env_url = decodeURIComponent(values[3]);
                data.source = blob;

                break;
            }
        }
    }
    if(data) {
        return data;
    }
    else {
        showLoading();
        await fetchEnvironmentAndCubeMaps(globalEnv)
        .then(async () => {
           hideLoading();
            
            newData = await fetchEnvironmentFromCache(globalEnv);
            
            return newData;
        })
    }
}

//THIS WILL BE USED TO CHECK IF GLOBAL ENV HAS LOCAL .ENV AND LOCAL CUBEMAPS
async function fetchEnvironmentAndCubeMapsFromCache(data) {

    globalEnv = data.id;
    let fileCount = 0;

    //CACHE IS THE LOCAL FOLDER PATH OF TABLE
    let cache = await caches.open('res_environments');

    //KEYS ARE EVERY KEY OR RECORD INSIDE CACHE
    let keys = await cache.keys(); 

    //COUNT IF 7 FILES ARE ASSOCIATED WITH GLOBALENV
    for(let a = 0; a < keys.length; a++) {
       
        //CONVERT KEY FORMAT TO REMOVE THE ORIGIN AND ONLY THE PATHNAME
        //REMOVING 127.0.0.1/ OR createwondr.com/ PART
        keys[a] = keys[a].url.replace(window.location.origin, '');
        //DECODE THE URI COMPONENT TO REMOVE URL SYMBOLS LIKE %20 FOR SPACE

        //NOW WE SPLIT THE RAW KEY BY '/' TO GET EACH SUPABASE EQUIVALENT COLUMN
        let values = keys[a].split('/');

        //HERE WE GET THE 'SIMULATED' RESPONSE FROM CACHE API
        //CACHE.MATCH IS REQUIRED SIMULATING A FETCH REQUEST AND MATCHING
        let response = await cache.match(keys[a]);
        //AFTER FETCHING THE RESULT, CONVERT THE RESPONSE AS TEXT
        //PASS THIS SOURCE AS DATA[A].SOURCE TO COMPLETE THE DATA OBJECT
        let blob = await response.blob();

    
        //[!] NEED TO DECODE INDIVIDUALLY
        //CAN'T ENCODE THE ENTIRE KEY STRING
        if(keys[a].includes('.env')) {

            if(decodeURIComponent(values[2]) == globalEnv) {
                if(blob != null) {
                    fileCount++;
                }
            }
        }
        else {
            if(decodeURIComponent(values[2]) == globalEnv) {

                if(blob != null) {
                    fileCount++;
                }
            }
        }
        
    }

    //IF LESS THAN 7 FILES (6 CUBEMAPS AND 1 ENV)
    //THEN DOWNLOAD GLOBALENV AND STORE
    if(fileCount < 7) {
        await storeEnvironmentAndCubeMapsToCache(data);
    }

}





