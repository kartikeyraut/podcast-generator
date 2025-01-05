// https://help.apple.com/itc/podcasts_connect/#/itcbaf351599
const fs = require('fs');
const yaml = require('js-yaml');
const { create } = require('xmlbuilder2');

// Read the YAML file
fs.readFile('feed.yaml', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading YAML file:", err);
    return;
  }

  // Parse the YAML data
  const yamlData = yaml.load(data);

  // Build the RSS feed XML using xmlbuilder2
  const rssElement = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('rss', {
      version: '2.0',
      'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
    })
    .ele('channel')
    .ele('title').txt(yamlData.title).up() // Title of the podcast
    .ele('link').txt('https://www.apple.com/itunes/podcasts/').up() // Link to podcast
    .ele('language').txt(yamlData.language).up() // Language
    .ele('copyright').txt('© 2023 Ray Villalobos').up() // Copyright
    .ele('itunes:author').txt(yamlData.author).up() // Author (itunes)
    .ele('description').txt(yamlData.description).up() // Description
    .ele('itunes:type').txt('serial').up() // Type of podcast
    .ele('itunes:image').att('href', yamlData.image).up() // Podcast image
    .ele('itunes:category').att('text', yamlData.category).up(); // Category

  // Iterate over episodes and add them as <item> elements
  yamlData.item.forEach(episode => {
    rssElement.ele('item')
      .ele('itunes:episodeType').txt('full').up() // Episode type
      .ele('title').txt(episode.title).up() // Episode title
      .ele('description').txt(episode.description).up() // Episode description
      .ele('pubDate').txt(episode.published).up() // Published date
      .ele('enclosure')
        .att('length', episode.length)
        .att('type', 'audio/mpeg') // MP3 audio type
        .att('url', episode.file).up() // File URL (Ensure it's a `.mp3` file)
      .ele('guid').txt(episode.title + '-' + episode.published).up() // GUID
      .ele('itunes:duration').txt(episode.duration).up() // Duration
      .ele('itunes:explicit').txt('false').up(); // Explicit content
  });

  // Generate the XML string with the declaration already included
  const xmlString = rssElement.end({ prettyPrint: true });

  // Write the XML to a file
  fs.writeFile('podcast.xml', xmlString, 'utf8', (err) => {
    if (err) {
      console.error("Error writing XML file:", err);
    } else {
      console.log('podcast.xml has been created.');
    }
  });
});
