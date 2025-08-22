import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { defaultCustomThemeOptions, createThemeFromCustomOptions } from './customThemeUtils';
import type { CustomThemeOptions } from './customThemeUtils';
import './ThemeBuilder.css';

export const ThemeBuilder: React.FC = () => {
  const { setCustomTheme, removeCustomTheme, applyTheme } = useTheme();
  const [customOptions, setCustomOptions] = useState<CustomThemeOptions>({
    ...defaultCustomThemeOptions,
    name: `custom-${new Date().getTime()}`,
  });
  const [savedThemes, setSavedThemes] = useState<CustomThemeOptions[]>([]);

  // Load saved custom themes from localStorage on component mount
  useEffect(() => {
    const savedThemesString = localStorage.getItem('customThemes');
    if (savedThemesString) {
      try {
        setSavedThemes(JSON.parse(savedThemesString));
      } catch (e) {
        console.error('Failed to parse saved themes', e);
      }
    }
  }, []);

  // Save custom themes to localStorage
  const saveCustomThemes = (themes: CustomThemeOptions[]) => {
    localStorage.setItem('customThemes', JSON.stringify(themes));
    setSavedThemes(themes);
  };

  // Handle changes to form inputs
  const handleChange = (field: keyof CustomThemeOptions, value: string | number) => {
    setCustomOptions({
      ...customOptions,
      [field]: value,
    });
  };

  // Apply the custom theme
  const handleApplyTheme = () => {
    const theme = createThemeFromCustomOptions(customOptions);
    setCustomTheme(theme);
    applyTheme(theme.name);
  };

  // Save the current custom theme
  const handleSaveTheme = () => {
    const themeExists = savedThemes.some(theme => theme.name === customOptions.name);
    
    if (themeExists) {
      // Update existing theme
      const updatedThemes = savedThemes.map(theme => 
        theme.name === customOptions.name ? customOptions : theme
      );
      saveCustomThemes(updatedThemes);
    } else {
      // Add new theme
      saveCustomThemes([...savedThemes, customOptions]);
    }

    // Apply the theme after saving
    handleApplyTheme();
  };

  // Delete a saved theme
  const handleDeleteTheme = (themeName: string) => {
    // Remove from savedThemes state and localStorage
    const updatedThemes = savedThemes.filter(theme => theme.name !== themeName);
    saveCustomThemes(updatedThemes);
    
    // Remove from ThemeContext to ensure it's not available in the app anymore
    removeCustomTheme(themeName);
    
    // If the theme being deleted is currently being edited, reset to default
    if (customOptions.name === themeName) {
      setCustomOptions({
        ...defaultCustomThemeOptions,
        name: `custom-${new Date().getTime()}`,
      });
    }
  };

  // Load a saved theme
  const handleLoadTheme = (theme: CustomThemeOptions) => {
    setCustomOptions(theme);
  };

  // Generate a preview style
  const getPreviewStyle = () => {
    return {
      backgroundColor: customOptions.backgroundColor,
      color: customOptions.textPrimaryColor,
    };
  };

  // Generate a message preview style
  const getMessagePreviewStyle = (isUser: boolean) => {
    return {
      backgroundColor: isUser 
        ? customOptions.messageUserBackground 
        : customOptions.messageAssistantBackground,
      color: isUser 
        ? customOptions.messageUserText 
        : customOptions.messageAssistantText,
      borderRadius: `${customOptions.borderRadius}px`,
      padding: `${customOptions.spacing}px ${customOptions.spacing * 2}px`,
      marginBottom: `${customOptions.spacing}px`,
    };
  };

  return (
    <div className="theme-builder">
      <div className="theme-builder-panel">
        <h2>Custom Theme Builder</h2>
        
        {/* Theme Preview at the top */}
        <div className="theme-preview-container">
          <div className="theme-preview" style={getPreviewStyle()}>
            <h3>Live Theme Preview</h3>
            <div style={getMessagePreviewStyle(true)}>
              User message example
            </div>
            <div style={getMessagePreviewStyle(false)}>
              Assistant message example
            </div>
            <div style={{
              backgroundColor: customOptions.inputBackground,
              color: customOptions.inputText,
              border: `1px solid ${customOptions.inputBorder}`,
              borderRadius: `${customOptions.borderRadius}px`,
              padding: `${customOptions.spacing}px`,
            }}>
              Input field example
            </div>
          </div>
        </div>
        
        {/* Theme Settings below in a scrollable container */}
        <div className="theme-settings-container">
          <div className="theme-builder-form">
            <div className="form-group">
              <label htmlFor="themeName">Theme Name:</label>
              <input
                id="themeName"
                type="text"
                value={customOptions.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <h3>Colors</h3>
            
            <div className="form-group color-group">
              <label htmlFor="primaryColor">Primary Color:</label>
              <div className="color-input-container">
                <input
                  id="primaryColor"
                  type="color"
                  value={customOptions.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group color-group">
              <label htmlFor="secondaryColor">Secondary Color:</label>
              <div className="color-input-container">
                <input
                  id="secondaryColor"
                  type="color"
                  value={customOptions.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group color-group">
              <label htmlFor="backgroundColor">Background Color:</label>
              <div className="color-input-container">
                <input
                  id="backgroundColor"
                  type="color"
                  value={customOptions.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group color-group">
              <label htmlFor="surfaceColor">Surface Color:</label>
              <div className="color-input-container">
                <input
                  id="surfaceColor"
                  type="color"
                  value={customOptions.surfaceColor}
                  onChange={(e) => handleChange('surfaceColor', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.surfaceColor}
                  onChange={(e) => handleChange('surfaceColor', e.target.value)}
                />
              </div>
            </div>

            <h3>Text Colors</h3>

            <div className="form-group color-group">
              <label htmlFor="textPrimaryColor">Text Primary:</label>
              <div className="color-input-container">
                <input
                  id="textPrimaryColor"
                  type="color"
                  value={customOptions.textPrimaryColor}
                  onChange={(e) => handleChange('textPrimaryColor', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.textPrimaryColor}
                  onChange={(e) => handleChange('textPrimaryColor', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group color-group">
              <label htmlFor="textSecondaryColor">Text Secondary:</label>
              <div className="color-input-container">
                <input
                  id="textSecondaryColor"
                  type="color"
                  value={customOptions.textSecondaryColor}
                  onChange={(e) => handleChange('textSecondaryColor', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.textSecondaryColor}
                  onChange={(e) => handleChange('textSecondaryColor', e.target.value)}
                />
              </div>
            </div>

            <h3>Message Colors</h3>

            <div className="form-group color-group">
              <label htmlFor="messageUserBackground">User Message Background:</label>
              <div className="color-input-container">
                <input
                  id="messageUserBackground"
                  type="color"
                  value={customOptions.messageUserBackground}
                  onChange={(e) => handleChange('messageUserBackground', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.messageUserBackground}
                  onChange={(e) => handleChange('messageUserBackground', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group color-group">
              <label htmlFor="messageUserText">User Message Text:</label>
              <div className="color-input-container">
                <input
                  id="messageUserText"
                  type="color"
                  value={customOptions.messageUserText}
                  onChange={(e) => handleChange('messageUserText', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.messageUserText}
                  onChange={(e) => handleChange('messageUserText', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group color-group">
              <label htmlFor="messageAssistantBackground">Assistant Message Background:</label>
              <div className="color-input-container">
                <input
                  id="messageAssistantBackground"
                  type="color"
                  value={customOptions.messageAssistantBackground}
                  onChange={(e) => handleChange('messageAssistantBackground', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.messageAssistantBackground}
                  onChange={(e) => handleChange('messageAssistantBackground', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group color-group">
              <label htmlFor="messageAssistantText">Assistant Message Text:</label>
              <div className="color-input-container">
                <input
                  id="messageAssistantText"
                  type="color"
                  value={customOptions.messageAssistantText}
                  onChange={(e) => handleChange('messageAssistantText', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.messageAssistantText}
                  onChange={(e) => handleChange('messageAssistantText', e.target.value)}
                />
              </div>
            </div>

            <h3>Input Colors</h3>

            <div className="form-group color-group">
              <label htmlFor="inputBackground">Input Background:</label>
              <div className="color-input-container">
                <input
                  id="inputBackground"
                  type="color"
                  value={customOptions.inputBackground}
                  onChange={(e) => handleChange('inputBackground', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.inputBackground}
                  onChange={(e) => handleChange('inputBackground', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group color-group">
              <label htmlFor="inputText">Input Text:</label>
              <div className="color-input-container">
                <input
                  id="inputText"
                  type="color"
                  value={customOptions.inputText}
                  onChange={(e) => handleChange('inputText', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.inputText}
                  onChange={(e) => handleChange('inputText', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group color-group">
              <label htmlFor="inputBorder">Input Border:</label>
              <div className="color-input-container">
                <input
                  id="inputBorder"
                  type="color"
                  value={customOptions.inputBorder}
                  onChange={(e) => handleChange('inputBorder', e.target.value)}
                />
                <input
                  type="text"
                  value={customOptions.inputBorder}
                  onChange={(e) => handleChange('inputBorder', e.target.value)}
                />
              </div>
            </div>

            <h3>Styling</h3>

            <div className="form-group">
              <label htmlFor="borderRadius">Border Radius (px):</label>
              <input
                id="borderRadius"
                type="number"
                min="0"
                max="20"
                value={customOptions.borderRadius}
                onChange={(e) => handleChange('borderRadius', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="spacing">Spacing (px):</label>
              <input
                id="spacing"
                type="number"
                min="4"
                max="24"
                value={customOptions.spacing}
                onChange={(e) => handleChange('spacing', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="theme-builder-actions">
              <button onClick={handleApplyTheme}>
                Apply Theme
              </button>
              <button onClick={handleSaveTheme}>
                Save Theme
              </button>
            </div>

            {savedThemes.length > 0 && (
              <div className="saved-themes">
                <h3>Saved Themes</h3>
                <ul>
                  {savedThemes.map((theme) => (
                    <li key={theme.name}>
                      <span>{theme.name}</span>
                      <div>
                        <button onClick={() => handleLoadTheme(theme)}>Load</button>
                        <button onClick={() => handleDeleteTheme(theme.name)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="delete-all-themes">
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete all custom themes? This cannot be undone.')) {
                        // Delete all themes one by one
                        savedThemes.forEach(theme => {
                          // Remove from ThemeContext
                          removeCustomTheme(theme.name);
                        });
                        // Clear all saved themes
                        saveCustomThemes([]);
                        // Reset to light theme
                        applyTheme('light');
                        // Reset the current options to default
                        setCustomOptions({
                          ...defaultCustomThemeOptions,
                          name: `custom-${new Date().getTime()}`,
                        });
                      }
                    }}
                  >
                    Delete All Custom Themes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeBuilder;
