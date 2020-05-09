import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppToastService {

  toasts: any[] = [];

  known_errors={'Please read with documents and check agree flag':$localize`:@@errors.please_agree:Please read with documents and check agree flag`,
                'Please, correct mistakes':$localize`:@@errors.please_correct_mistakes:Please, correct mistakes`,
                'Credit product error': $localize`:@@errors.credit_product_error:Credit product error`,
                'Changing is not allowed':$localize`:@@errors.changing_not_allowed:Changing is not allowed`,
                'Unknow field':$localize`:@@errors.unknow_field:Unknow field`,
                'Value should be number':$localize`:@@errors.value_should_be_number:Value should be number`,
                'Value should be string':$localize`:@@errors.value_should_be_string:Value should be string`,
                'Value should be object':$localize`:@@errors.value_should_be_object:Value should be object`,
                'Value should be date':$localize`:@@errors.value_should_be_date:Value should be date`,
                'Value should be boolean':$localize`:@@errors.value_should_be_boolean:Value should be boolean`,
                'Value is too long':$localize`:@@errors.value_too_long:Value is too long`,
                'Invalid value':$localize`:@@errors.invalid_value:Invalid value`,
                'OrgID header is required':$localize`:@@errors.org_id_required:OrgID header is required`,
                'Access denied':$localize`:@@errors.access_denied:Access denied`,
                'Not found':$localize`:@@errors.not_found:Not found`,
                'Phone is required':$localize`:@@errors.phone_is_required:Phone is required`,
                'Invalid phone':$localize`:@@errors.invalid_phone:Invalid phone`,
                'Email is required':$localize`:@@errors.email_is_required:Email is required`,
                'Not initialized':$localize`:@@errors.not_initialized:Not initialized`,
                'Invalid userdata':$localize`:@@errors.invalid_userdata:Invalid userdata`,
                'Unauthorized':$localize`:@@errors.unauthorized:Unauthorized`,
                'Missed parameter':$localize`:@@errors.missed_parameter:Missed parameter`,
                'Forbidden':$localize`:@@errors.forbidden:Forbidden`,
                "Can't create a loan - phone is not yet verified":$localize`:@@errors.phone_is_not_yet_verified:Can't create a loan - phone is not yet verified`,
                "Can't create a loan - email is not yet verified":$localize`:@@errors.email_is_not_yet_verified:Can't create a loan - email is not yet verified`,
                'Credit product not found':$localize`:@@errors.credit_product_not_found:Credit product not found`,
                'Credit product is not available':$localize`:@@errors.credit_product_is_not_available:Credit product is not available`,
                'Loan amount too small':$localize`:@@errors.loan_amount_too_small:Loan amount too small`,
                'Loan amount too large':$localize`:@@errors.loan_amount_too_large:Loan amount too large`,
                'Loan term too small':$localize`:@@errors.loan_term_too_small:Loan term too small`,
                'Loan term too large':$localize`:@@errors.loan_term_too_large:Loan term too large`,
                'Card not found':$localize`:@@errors.card_not_found:Card not found`,
                'Inappropriate сard':$localize`:@@errors.inappropriate_сard:Inappropriate сard`,
                'Credit history agreement not signed':$localize`:@@errors.credit_history_agreement_not_signed:Credit history agreement not signed`,
                'Credit history agreement expired and should be signed again':$localize`:@@errors.credit_history_agreement_expired:Credit history agreement expired and should be signed again`,
                'Loan not found':$localize`:@@errors.loan_not_found:Loan not found`,
                "This loan can't be canceled":$localize`:@@errors.loan_cannot_be_canceled:This loan can't be canceled`,
                'Successfully canceled':$localize`:@@errors.successfully_canceled:Successfully canceled`,
                'Inappropriate loan status':$localize`:@@errors.inappropriate_loan_status:Inappropriate loan status`,
                'Inappropriate decision':$localize`:@@errors.inappropriate_decision:Inappropriate decision`,
                'Unable to unlink card with active loan/applications':$localize`:@@errors.unable_unlink_since_loan_active:Unable to unlink card with active loan/applications`,
                'Loan preview not found':$localize`:@@errors.loan_preview_not_found:Loan preview not found`,
                'Successfully signed':$localize`:@@errors.successfully_signed:Successfully signed`,
                'Verification already started':$localize`:@@errors.verification_already_started:Verification already started`,
                'Phone already verified':$localize`:@@errors.phone_already_verified:Phone already verified`,
                'SMS code is required':$localize`:@@errors.sms_code_is_required:SMS code is required`,
                'Wrong code':$localize`:@@errors.wrong code:wrong code`,
                'Inopropriate status':$localize`:@@errors.inopropriate_status:Inopropriate status`,
                'Edit application fordbidden':$localize`:@@errors.edit_application_forbidden:Edit application fordbidden`,
                'SMS code not found or expired':$localize`:@@errors.sms_code_not_found_or_expired:SMS code not found or expired`,
                'SMS code expired':$localize`:@@errors.sms_code_expired:SMS code expired`,
                'Too many attempts':$localize`:@@errors.too_many_attempts:Too many attempts`,
                'Password too short':$localize`:@@errors.password_too_short:Password too short`,
                'Invalid old password':$localize`:@@errors.invalid_old_password:Invalid old password`,
                'Password successfully changed':$localize`:@@errors.password_successfully_changed:Password successfully changed`,
                'New passwords not match':$localize`:@@errors.new_passwords_not_match:New passwords not match`,
                'Password reset requested. Please check your inbox':$localize`:@@errors.password_reset_requested:Password reset requested. Please check your inbox`,
                'Invalid email':$localize`:@@errors.invalid_email:Invalid email`,
                'Only one active application/loan allowed':$localize`:@@errors.only_one_application_allowed:Only one active application/loan allowed`};

  constructor() { }

  show(header: string, body: any, classname: string) {
    let addl="";
    if (typeof body === 'object') {
      addl=": "+body['field'];
      body=body['message'];
    }
    if (this.known_errors[body])
      body=this.known_errors[body];
    body+=addl;
    this.toasts.push({ header, body, classname });
  }
  remove(toast) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}
