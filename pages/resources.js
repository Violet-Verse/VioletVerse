import Script from "next/script";

const Resources = () => {
    return (
        <div key="1">
            <p
                className="loxi"
                data-background-color="transparent"
                data-categories="all"
                data-color="#7fc11c"
                data-default-layout="list"
                data-font-family=""
                data-is-demo="false"
                data-show-category-filter="1"
                data-show-location-address="1"
                data-show-location-filter="1"
                data-show-search-filter="1"
                data-show-view-switcher="1"
                data-show-list-view-image="1"
                data-show-social-media-buttons="1"
                data-site-id="69516"
                data-subdomain="violet-verse"
                data-theme="light"
                data-timezone="America/New_York"
                data-title="Violet Verse"
                data-venue="all"
            ></p>
            <Script src="https://violet-verse.loxi.io/embed/client.js" />
        </div>
    );
};

export default Resources;
