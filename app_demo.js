const puppeteer = require('puppeteer');

let bookingUrl = 'https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAEoggI46AdIM1gEaGyIAQGYAQm4ARnIAQzYAQHoAQH4AQuIAgGoAgO4Av6OsvQFwAIB&sid=e9c1d12ae7136fc303458eda7769ce38&sb=1&sb_lp=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.en-gb.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaGyIAQGYAQm4ARnIAQzYAQHoAQH4AQuIAgGoAgO4Av6OsvQFwAIB%3Bsid%3De9c1d12ae7136fc303458eda7769ce38%3Bsb_price_type%3Dtotal%26%3B&ss=Bangalore%2C+Karnataka%2C+India&is_ski_area=&checkin_year=2020&checkin_month=4&checkin_monthday=16&checkout_year=2020&checkout_month=5&checkout_monthday=12&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&ss_raw=ban&ac_position=0&ac_langcode=en&ac_click_type=b&dest_id=-2090174&dest_type=city&iata=BLR&place_id_lat=12.976346&place_id_lon=77.601844&search_pageview_id=185a627f4179012b&search_selected=true&search_pageview_id=185a627f4179012b&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0';
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(bookingUrl);

    // get hotel details
    let hotelData = await page.evaluate(() => {
        let hotels = [];
        // get the hotel elements
        let hotelsElms = document.querySelectorAll('div.sr_property_block[data-hotelid]');
        // get the hotel data
        hotelsElms.forEach((hotelelement) => {
            let hotelJson = {};
            try {
                hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
                hotelJson.reviews = hotelelement.querySelector('span.review-score-widget__subtext').innerText;
                hotelJson.rating = hotelelement.querySelector('span.review-score-badge').innerText;
                if(hotelelement.querySelector('strong.price')){
                    hotelJson.price = hotelelement.querySelector('strong.price').innerText;
                }
            }
            catch (exception){

            }
            hotels.push(hotelJson);
        });
        return hotels;
    });

    console.dir(hotelData);
})();
