module.exports = function(eleventyConfig) {
    // 資源複製
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/css");

    // 配置
    // 偵測是否為本地開發伺服器模式
    const isLocalServer = process.argv.includes('--serve');

    return {
        dir: {
            input: "src",
            output: "dist"
        },
        // 確保線上部署與本地端在不同路徑下運作
        pathPrefix: process.env.GITHUB_PAGES ? "/game-info-site/" : "/",
        templateFormats: ["njk", "md", "html"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};
