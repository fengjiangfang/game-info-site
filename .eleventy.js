module.exports = function(eleventyConfig) {
    // 配置複製靜態資源
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/style.css");

    // 判斷是否為生產環境 (GitHub Pages 部署)
    // 如果執行 npm run build，輸出時加上路徑前綴；如果是 8080 預覽，則使用根目錄
    const isProduction = process.env.NODE_ENV === 'production';
    const pathPrefix = isProduction ? "/game-info-site/" : "/";

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
