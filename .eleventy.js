module.exports = function(eleventyConfig) {
    // 配置複製靜態資源
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/style.css");

    // 強制鎖定 GitHub Pages 的路徑前綴，確保線上環境 100% 正常
    const pathPrefix = "/game-info-site/";

    return {
        dir: {
            input: "src",
            output: "dist"
        },
        pathPrefix: pathPrefix,
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk"
    };
};
