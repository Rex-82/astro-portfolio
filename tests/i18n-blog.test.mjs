import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	postsForLocale,
	publicSlug,
	translationFor,
	validatePosts,
	publishedPosts,
} from '../src/lib/blog-model.ts';

const post = (id, lang, translationKey, draft = false) => ({
	id,
	data: { lang, translationKey, draft, pubDate: new Date('2026-01-01') },
});
const english = post('first', 'en', 'first');
const italian = post('it/primo', 'it', 'first');
const onlyEnglish = post('second', 'en', 'second');
const draftItalian = post('it/secondo', 'it', 'second', true);
const fixture = [english, italian, onlyEnglish, draftItalian];

test('pairs published translations and keeps one fallback per article', () => {
	const published = publishedPosts(fixture);
	validatePosts(published);
	assert.equal(publicSlug(italian), 'primo');
	assert.equal(translationFor(published, english, 'it'), italian);
	assert.equal(translationFor(published, onlyEnglish, 'it'), undefined);
	assert.deepEqual(
		new Set(postsForLocale(published, 'it')),
		new Set([italian, onlyEnglish]),
	);
	assert.deepEqual(
		new Set(postsForLocale(published, 'en')),
		new Set([english, onlyEnglish]),
	);
	assert.equal(postsForLocale(fixture, 'it').includes(draftItalian), false);
});

test('rejects duplicate translation keys and public slugs per language', () => {
	assert.throws(
		() => validatePosts([english, post('another', 'en', 'first')]),
		/Duplicate blog translation or slug: another/,
	);
	assert.throws(
		() =>
			validatePosts([
				english,
				post('another', 'en', 'another'),
				italian,
				post('it/primo/index', 'it', 'another'),
			]),
		/Duplicate blog translation or slug: it\/primo\/index/,
	);
	assert.throws(
		() => validatePosts([italian]),
		/Italian translation has no English original: it\/primo/,
	);
	validatePosts([english, italian]);
});
