module.exports = function(eleventyConfig) {
    // 配置複製靜態資源
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/style.css");

    // 設定 Eleventy 的渲染與路徑行為
    return {
        dir: {
            input: "src",
            output: "dist"
        },
        pathPrefix: "/game-info-site/",
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
};
