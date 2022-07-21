const EmbedVideo = function (props) {
    return (
        <div
            dangerouslySetInnerHTML={{
                __html: `
         <video
          poster="/banners/thumbnail.jpeg"
           loop
           muted
           autoplay
           playsinline
           width="100%"
           src="${props.src}"
           class="${props.className}"
         />,
       `,
            }}
        ></div>
    );
};

export default EmbedVideo;
