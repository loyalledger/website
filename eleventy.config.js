const Image = require("@11ty/eleventy-img");
const eleventyNavigation = require("@11ty/eleventy-navigation");
const yaml = require("js-yaml");
const { parse } = require('csv-parse/sync');
const { EleventyRenderPlugin } = require("@11ty/eleventy");

async function imageShortcode(src, alt = '', widths = []) {
    if ( !src.startsWith('http') ) {
        src = "./content/assets/img/" + src
    }
	let options = { widths: [...widths, null], formats: ['auto'], outputDir: "./_site/img/", };
    let stats = await Image(src, options);
    let props = Object.values(stats)[0][0]
    return `<img src="${props.url}" width="${props.width}" height="${props.height}" alt="${alt}">`;
}

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(eleventyNavigation);
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addShortcode("renderVariable", async function (template, data) {
        const { renderTemplate } = eleventyConfig.javascriptFunctions;
        return await renderTemplate(template, 'njk', data );
    });
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
    eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
    eleventyConfig.addDataExtension("csv", contents => parse(contents, { columns: true, skip_empty_lines: true }));

    eleventyConfig.addPassthroughCopy("./content/assets");

    return {
        dir: {
			input: "./content",          
			includes: "../_includes", 
            layouts: "../_layouts",
			data: "../_data",
			output: "./_site",
		},
        markdownTemplateEngine: "njk",
	}
}
