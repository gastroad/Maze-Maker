import '@testing-library/jest-dom/extend-expect'

const { setup: setupPuppeteer } = require('jest-environment-puppeteer');

module.exports = async () => {
    await setupPuppeteer();
};