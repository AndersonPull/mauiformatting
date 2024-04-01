import * as assert from 'assert';
import { XamlFormatter } from "../formatting/xaml-formatter";
import fs from 'fs';
import { Settings } from "../common/settings";
import * as vscode from 'vscode';

suite('Basic Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Default formatting', async () => {
		let settings = new Settings();
		await testFormatter('basic', 'basic', settings);
	});

	test('All attributes in the first line', async () => {
		let settings = new Settings();
		settings.positionAllAttributesOnFirstLine = true;
		await testFormatter('basicAllAttributesInTheFirstLine', 'basic', settings);
	});

	test('Two attributes per line', async () => {
		let settings = new Settings();
		settings.attributesInNewlineThreshold = 2;
		settings.putTheFirstAttributeOnTheFirstLine = true;
		await testFormatter('basicTwoAttributesPerLine', 'basic', settings);
	});

	test('Do not use self-closing tags', async () => {
		let settings = new Settings();
		settings.useSelfClosingTags = false;
		await testFormatter('basicDoNotUseSelf-closingTags', 'basic', settings);
	});
});

async function testFormatter(fileNameFormatted: string, fileNameUnformatted: string, settings: Settings): Promise<void> {
	let xamlFormatter = new XamlFormatter();

	const expectedFormattedXaml = dataLoader(`${fileNameFormatted}.formatted.xaml`).replace(/\r/g, "");
	const unformattedXaml = dataLoader(`${fileNameUnformatted}.unformatted.xaml`);

	const document = await vscode.workspace.openTextDocument({ content: unformattedXaml });
	const textEdits = xamlFormatter.formatXaml(document, settings);

	const actualFormattedText = textEdits.map(edit => edit.newText).join('');
	assert.strictEqual(actualFormattedText, expectedFormattedXaml, 'The current formatted XAML does not match the expected formatted XAML.');
}

function dataLoader(fileName: string): string {
	return fs.readFileSync(`${__dirname}/../../src/test/data/${fileName}`, 'utf-8');
}