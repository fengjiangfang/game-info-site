module.exports = function(eleventyConfig) {
    // 新增建置時間戳記用於快取清除 (Cache Busting)
    eleventyConfig.addGlobalData("buildTime", Date.now());

    // 資源複製
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/style.css");

    // 配置
    return {
        dir: {
            input: "src",
            output: "dist"
        },
        pathPrefix: "/game-info-site/"
    };
};
