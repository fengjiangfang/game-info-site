module.exports = function(eleventyConfig) {
    // 配置複製靜態資源
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/style.css");

    // 修改：判斷是否在 Eleventy 的 --serve (本地開發) 模式下
    // 如果是 --serve，則不使用 pathPrefix 以免 8080 壞掉
    // 如果是運行 build，則使用 /game-info-site/ 供 GitHub 使用
    const pathPrefix = process.env.ELEVENTY_RUN_MODE === 'serve' ? "/" : "/game-info-site/";

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
