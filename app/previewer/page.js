'use client';
import { useState, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import React from 'react';
import './previewer.css';
import defaultCodes from './defaultCodes';
import * as ts from 'typescript';
import * as Babel from '@babel/standalone';

export default function Previewer() {
  const [code, setCode] = useState(defaultCodes.javascript);
  const [Component, setComponent] = useState(() => () => <p>Write some code...</p>);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [dropdownLanguageOpen, setDropdownLanguageOpen] = useState(false);
  const [dropdownThemeOpen, setDropdownThemeOpen] = useState(false);

  useEffect(() => {
    try {
      if (language === 'html') {
        setComponent(() => () => <div dangerouslySetInnerHTML={{ __html: code }} />);
        setError('');
      } else {
        let transpiledCode = code;

        if (language === 'typescript') {
          const result = ts.transpileModule(code, {
            compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React },
          });
          transpiledCode = result.outputText;
        } else {
          const transpiledJSCode = Babel.transform(code, {
            presets: ['react'],
          }).code;
          transpiledCode = transpiledJSCode;
        }

        const DynamicComponent = new Function('React', `
          ${transpiledCode}
          return MyComponent;
        `)(React);

        if (typeof DynamicComponent === 'function') {
          setComponent(() => DynamicComponent);
          setError('');
        } else {
          throw new Error('The transpiled code does not return a valid component.');
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }, [code, language]);

  const handleEditorChange = (newValue) => {
    setCode(newValue);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(defaultCodes[lang]);
    setDropdownLanguageOpen(false);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setDropdownThemeOpen(false);
  };

  return (
    <div className="wrapper">
      <div className="navbar">
        <h1>Code Previewer</h1>
        <div className="dropdowns">
          <div className="dropdown">
            <button onClick={() => setDropdownLanguageOpen(!dropdownLanguageOpen)}>
              {language.charAt(0).toUpperCase() + language.slice(1)} ▼
            </button>
            {dropdownLanguageOpen && (
              <div className="dropdown-menu">
                {['javascript', 'typescript', 'html'].map((lang) => (
                  <div key={lang} className="dropdown-item" onClick={() => handleLanguageChange(lang)}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown">
            <button onClick={() => setDropdownThemeOpen(!dropdownThemeOpen)}>
              {theme === 'vs-dark' ? 'Dark Theme' : 'Light Theme'} ▼
            </button>
            {dropdownThemeOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => handleThemeChange('vs-dark')}>
                  Dark Theme
                </div>
                <div className="dropdown-item" onClick={() => handleThemeChange('vs-light')}>
                  Light Theme
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="editor-preview-wrapper">
        <div className="editor-container">
          <h3>Code Editor</h3>
          <MonacoEditor
            width="100%"
            height="80vh"
            language={language}
            theme={theme}
            value={code}
            onChange={handleEditorChange}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
            }}
          />
        </div>
        <div className={`preview-container ${theme === 'vs-dark' ? 'dark' : 'light'}`}>
          <h3>Live Preview</h3>
          <div className="preview-box">
            {error ? <p className="error">Error: {error}</p> : <Component />}
          </div>
        </div>
      </div>
    </div>
  );
}
