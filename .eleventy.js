module.exports = function(eleventyConfig) {
    // 配置複製靜態資源
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/style.css");

    // 修改：強制使用動態判斷，確保本地 8080 正常且 GitHub 正常
    // 在 Eleventy 3.x 中，開發模式的運行模式是 'serve'
    const isServe = process.env.ELEVENTY_RUN_MODE === 'serve';
    const pathPrefix = isServe ? "/" : "/game-info-site/";

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
