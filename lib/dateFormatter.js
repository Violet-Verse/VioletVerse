const dateFormatter = (date, time) => {
    if (date) {
        const readableCreated = new Date(date);
        const dateTimeFormat = new Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "long",
            day: "numeric",
            ...(time && { hour: "numeric" }),
            ...(time && { minute: "numeric" }),
        });
        return dateTimeFormat.format(readableCreated);
    }
};

export default dateFormatter;
