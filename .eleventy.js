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
        // 本地開發使用根目錄 /，部署 GitHub Pages 使用子目錄前綴
        pathPrefix: isLocalServer ? "/" : "/game-info-site/",
        templateFormats: ["njk", "md", "html"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};
