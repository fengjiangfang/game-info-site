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
        // 統一鎖定路徑前綴，確保本地與線上環境路徑結構一致，徹底移除 404 風險
        pathPrefix: "/game-info-site/",
        templateFormats: ["njk", "md", "html"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};
