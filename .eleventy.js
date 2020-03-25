// Put main config above
// to avoid distraction from complex configuration

const config = {
    // URL related
    pathPrefix: "/circleci-11ty/",

    // Templating Engine
    templateFormats: [
      "md",
      "njk",
      "html"
    ],

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // directory management
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "dist",
      // ⚠️ These values are both relative to your input directory.
      includes: "_includes",
      data: "_data"
    }
  };

const moment = require("moment");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {

  // Official plugin
  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(syntaxHighlight);
  
  // Miscellanous helper
  const helper = require("./src/_11ty/helper");

  // Directory management
  eleventyConfig.addPassthroughCopy("assets");

  // Layout alias
  eleventyConfig.addLayoutAlias("home",     "layouts/home.njk");
  eleventyConfig.addLayoutAlias("page",     "layouts/page.njk");
  eleventyConfig.addLayoutAlias("post",     "layouts/post.njk");
  eleventyConfig.addLayoutAlias("index",    "layouts/index.njk");
  eleventyConfig.addLayoutAlias("archives", "layouts/archives.njk");
  eleventyConfig.addLayoutAlias("tags",     "layouts/tags.njk");
  eleventyConfig.addLayoutAlias("tag-name", "layouts/tag-name.njk");

  // Miscellanous Filters
  
  // Copy paste from Jérôme Coupé
  eleventyConfig.addNunjucksFilter("date", function(date, format) {
    return moment(date).format(format);
  });

  // Custom: Grouping by date
  eleventyConfig.addNunjucksFilter("mapdate", function(posts) {
    return posts.map(post => ({ 
      ...post,
      year:      moment(post.date).format("Y"),
      month:     moment(post.date).format("MM"),
      monthtext: moment(post.date).format("MMMM")
    }));
  });

  // Copy paste from my other tutorial (Hexo)
  eleventyConfig.addNunjucksFilter("groupBy", function(posts, key) {
    return helper.groupBy(posts, key);
  });

  // Limit Filter: Copy paste from Jérôme Coupé
  eleventyConfig.addNunjucksFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });

  // values Filter: With the help of w3schools
  eleventyConfig.addNunjucksFilter("values", function(array) {
    return Object.values(array);
  });

  // values Filter: MDN web docs
  eleventyConfig.addNunjucksFilter("keys", function(array) {
    return Object.keys(array);
  });

  // Random Filter: With the help from google search engine
  eleventyConfig.addNunjucksFilter("shuffle", function(array) {
    return helper.shuffle(array);
  });

  // Meta Keywords: My own script
  eleventyConfig.addNunjucksFilter("keyJoin", function(tags, keywords) {
    return helper.keyJoin(tags, keywords);
  });

  // Pagination Hash: I finally make my own script here.
  // First Page is 1: Retarded array in contrast with zero based.
  eleventyConfig.addNunjucksFilter("hashIt", function(array) {
    var hash = {};
    var i;
    for (i = 0; i < array.length; i++) {
      hash[i+1] = array[i];
    } 

    return hash;
  });

  // Pagination Page: Again, I my own script. Whoaaa.
  // First Page has no additional path.
  eleventyConfig.addNunjucksFilter("pagerIt", function(pageNumber) {
    var path = "page-"+(pageNumber+1)+"/index.html";

    if (pageNumber == 0 ) { path = "index.html"; }

    return path;
  });

  // Miscellanous Collection

  // Copy paste from Zach Leatherman
  eleventyConfig.addCollection("tagList",
    require("./src/_11ty/getTagList"));

  // Filter using `Array.filter`
  eleventyConfig.addCollection("posts", function(collection) {
    return collection.getAllSorted().reverse().filter(function(item) {
      // Filter by layout name
      return "post" === item.data.layout;
    });
  });

  // Modified from Boris Schapira
  eleventyConfig.addCollection("postsPrevNext", function(collection) {
    var posts = collection.getAllSorted().filter(function(item) {
      // Filter by layout name
      return "post" === item.data.layout;
    });

    return helper.addPrevNext(posts);
  });

  // Miscellanous Shortcodes
  
  // Defines shortcode for generating post excerpts
  // Copy paste from Jérôme Coupé
  const excerpt = require("./src/_11ty/excerpt");
  eleventyConfig.addShortcode("excerpt",
    post => excerpt.extractExcerpt(post));

  // Internal Path
  eleventyConfig.addShortcode("pathPrefix", function() {
    return config.pathPrefix;
  });

  // External Path
  eleventyConfig.addShortcode("dotfiles", function() {
    return 'https://gitlab.com/epsi-rns/dotfiles/tree/master';
  });

  eleventyConfig.addShortcode("repo", function() {
    return 'https://gitlab.com/epsi-rns/tutor-11ty-materialize/tree/master/';
  });

  // Multiline Content with Parameter
  eleventyConfig.addShortcode("advert", function(src) {
    return `
  <img alt="advertisement" 
       src="${config.pathPrefix}assets/images/adverts/${src}">
    `;
  });

  // Done with all stuff
  // -- -- -- -- -- -- --

  // Return your Config object
  return config;
};
