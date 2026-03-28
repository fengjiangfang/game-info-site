module.exports = function(eleventyConfig) {
    // 資源複製
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/css");

    // 配置
    return {
        dir: {
            input: "src",
            output: "dist"
        },
        pathPrefix: "/game-info-site/"
    };
};
