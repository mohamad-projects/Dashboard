import { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import officeImage from '../../assets/soc.jpg';
const Contact = () => {
  const { translateMode } = useContext(DarkModeContext);

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">
          {translateMode ? 'Stay In Contact With Us' : 'ابقى على تواصل معنا'}
        </h1>
        <div className="contact-sections">
          <div className="left-container">
            <div className="company-card">
              <img src={officeImage} alt="Office" className="company-image" />
              <div className="company-details">
                <h3>{translateMode ? 'Company info' : 'معلومات الشركة'}</h3>
                <div className="info-line">
                  <span>{translateMode ? 'Email' : 'البريد'}</span>
                  <p>www.homefinder.com</p>
                </div>
                <div className="info-line">
                  <span>{translateMode ? 'Phone' : 'الهاتف'}</span>
                  <p>963568426</p>
                </div>
                <div className="info-line">
                  <span>{translateMode ? 'Address' : 'العنوان'}</span>
                  <p>Damascus barantech</p>
                </div>
              </div>
            </div>
          </div>

          <div className="vertical-divider"></div>

          <div className="right-container">
            <form className="contact-form">
              <div className="form-row">
                <label>{translateMode ? 'Your Name' : 'اسمك'}</label>
                <input type="text" className="form-input" />
              </div>
              
              <div className="form-row">
                <label>{translateMode ? 'Your Phone' : 'هاتفك'}</label>
                <input type="tel" className="form-input" />
              </div>
              <div className="form-row">
                <label>{translateMode ? 'Your Problem' : 'المشكلة'}</label>
                <textarea className="form-textarea"></textarea>
              </div>
              <button className="send-button">
                {translateMode ? 'Send' : 'إرسال'}
              </button>
            </form>
          </div>
        </div>

        <p className="contact-note">
          {translateMode
            ? 'You can contact us to tell us about your problems, and you can also make your suggestions to us'
            : 'يمكنك الاتصال بنا لإخبارنا بمشاكلك، كما يمكنك تقديم اقتراحاتك لنا'}
        </p>
      </div>
    </div>
  );
};

export default Contact;