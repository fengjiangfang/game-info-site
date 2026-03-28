module.exports = function (eleventyConfig) {
  // 將 CSS 與圖片複製到輸出的資料夾中
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/js");

  // 強制監聽資料夾變動以支援極速熱更新
  eleventyConfig.addWatchTarget("./src/_data/");
  eleventyConfig.addWatchTarget("./src/css/");
  eleventyConfig.addWatchTarget("./src/_includes/");

  // 最強穩定模式：全站重整，不論速度，只求必刷新
  eleventyConfig.setBrowserSyncConfig({
    files: './dist/**/*',
    watch: true,
    reloadDelay: 200 // 加入 200ms 的緩衝，確保檔案寫入完整後才刷新
  });

  const isProduction = process.env.NODE_ENV === "production";

  return {
    dir: {
      input: "src",
      output: "dist"
    },
    pathPrefix: "/game-info-site/"
  };
};
