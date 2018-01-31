import 'metal-modal';
import Component from 'metal-component';
import Soy from 'metal-soy';
import {Config} from 'metal-state';

import templates from './SimpleInputModal.soy';

/**
 * SimpleInputModal
 * @review
 */
class SimpleInputModal extends Component {
	/**
	 * @inheritDoc
	 * @review
	 */
	attached() {
		this.addListener('formSubmit', this._defaultFormSubmit.bind(this), true);
	}

	/**
	 * Default event listener for form submission.
	 * @param {Event} event
	 * @private
	 * @review
	 */
	_defaultFormSubmit(event) {
		fetch(this.formSubmitURL, {
			body: new FormData(event.form),
			credentials: 'include',
			method: 'POST',
		})
			.then(response => response.json())
			.then(responseContent => {
				this._loadingResponse = false;

				if (responseContent.error) {
					this._handleFormError(responseContent);
				} else {
					this._handleFormSuccess(responseContent);
				}
			})
			.catch(response => {
				this._handleFormError(response);
			});

		this._loadingResponse = true;
	}

	/**
	 * Callback executed when the SimpleInputModal cancel button
	 * has been clicked.
	 * @private
	 * @review
	 */
	_handleCancelButtonClick() {
		this.emit('cancelButtonClicked');
	}

	/**
	 * Callback executed when the SimpleInputModal form has been
	 * submited and it receives a server error as response.
	 * It emits a formError event with the errorMessage received.
	 * @param {{error: string}} responseContent
	 * @private
	 * @review
	 */
	_handleFormError(responseContent) {
		this._errorMessage = responseContent.error || '';

		this.emit('formError', {
			errorMessage: this._errorMessage,
		});
	}

	/**
	 * Callback executed when the SimpleInputModal form has been
	 * submited. It prevents the default behaviour and sends this form
	 * using a fetch request.
	 * @param {Event} event
	 * @private
	 * @review
	 */
	_handleFormSubmit(event) {
		event.preventDefault();

		this.emit('formSubmit', {
			form: this.refs.modal.refs.form,
		});
	}

	/**
	 * Callback executed when the SimpleInputModal form has been
	 * submited and it receives a server successful response.
	 * It emits a formSuccess event with the redirectURL received.
	 * @param {{redirectURL: string}} responseContent
	 * @private
	 * @review
	 */
	_handleFormSuccess(responseContent) {
		this.emit('formSuccess', {
			redirectURL: responseContent.redirectURL || '',
		});
	}

	/**
	 * Callback executed when the modal visibility property changes
	 * @private
	 * @review
	 */
	_handleModalVisibleChanged() {
		this.emit('dialogHidden');
	}
}

/**
 * State definition.
 * @review
 * @static
 * @type {!Object}
 */
SimpleInputModal.STATE = {
	/**
	 * Label for the optional checkbox
	 * @default ''
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {string}
	 */
	checkboxFieldLabel: Config.string().value(''),

	/**
	 * Name for the optional checkbox
	 * @default ''
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {string}
	 */
	checkboxFieldName: Config.string().value(''),

	/**
	 * Initial value for the optional checkbox
	 * @default false
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {boolean}
	 */
	checkboxFieldValue: Config.bool().value(false),

	/**
	 * Modal window title
	 * @default undefined
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {!string}
	 */
	dialogTitle: Config.string().required(),

	/**
	 * URL where the form will be submitted to
	 * @default undefined
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {!string}
	 */
	formSubmitURL: Config.string().required(),

	/**
	 * Autogenerated id provided by templates
	 * @default ''
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {string}
	 */
	id: Config.string().value(''),

	/**
	 * Name for the hidden id field
	 * @default ''
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {string}
	 */
	idFieldName: Config.string().value(''),

	/**
	 * Value for the hidden id field
	 * @default ''
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {string}
	 */
	idFieldValue: Config.string().value(''),

	/**
	 * Label for the main field
	 * @default undefined
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {!string}
	 */
	mainFieldLabel: Config.string().required(),

	/**
	 * Name for the main field
	 * @default undefined
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {!string}
	 */
	mainFieldName: Config.string().required(),

	/**
	 * Placeholder for the main field
	 * @default ''
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {string}
	 */
	mainFieldPlaceholder: Config.string().value(''),

	/**
	 * Initial value for the main field
	 * @default ''
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {string}
	 */
	mainFieldValue: Config.string().value(''),

	/**
	 * Namespace that will be prepended to field names
	 * @default undefined
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {!string}
	 */
	namespace: Config.string().required(),

	/**
	 * URL for the portal icons being used
	 * @default undefined
	 * @instance
	 * @memberOf SimpleInputModal
	 * @review
	 * @type {!string}
	 */
	spritemap: Config.string().required(),

	/**
	 * Form error message returned by the server
	 * @default ''
	 * @instance
	 * @memberOf SimpleInputModal
	 * @private
	 * @review
	 * @type {!string}
	 */
	_errorMessage: Config.string()
		.internal()
		.value(''),

	/**
	 * Flag indicating if we are waiting for a server response
	 * after a form submission.
	 * @default false
	 * @instance
	 * @memberOf SimpleInputModal
	 * @private
	 * @review
	 * @type {boolean}
	 */
	_loadingResponse: Config.bool()
		.internal()
		.value(false),
};

Soy.register(SimpleInputModal, templates);

export {SimpleInputModal};
export default SimpleInputModal;
