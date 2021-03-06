import { Inject, Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppState } from '../../app.reducer';
import { formObjectFromIdSelector } from './selectors';
import { FormBuilderService } from './builder/form-builder.service';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core';
import { isEmpty, isNotUndefined } from '../empty.util';
import { uniqueId } from 'lodash';
import { FormChangeAction } from './form.actions';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

@Injectable()
export class FormService {

  constructor(
    @Inject(GLOBAL_CONFIG) public config: GlobalConfig,
    private formBuilderService: FormBuilderService,
    private store: Store<AppState>) {
  }

  /**
   * Method to retrieve form's status from state
   */
  public isValid(formId: string): Observable<boolean> {
    return this.store.select(formObjectFromIdSelector(formId))
      .filter((state) => isNotUndefined(state))
      .map((state) => state.valid)
      .distinctUntilChanged();
  }

  /**
   * Method to retrieve form's data from state
   */
  public getFormData(formId: string): Observable<any> {
    return this.store.select(formObjectFromIdSelector(formId))
      .filter((state) => isNotUndefined(state))
      .map((state) => state.data)
      .distinctUntilChanged();
  }

  /**
   * Method to retrieve form's errors from state
   */
  public getFormErrors(formId: string): Observable<any> {
    return this.store.select(formObjectFromIdSelector(formId))
      .filter((state) => isNotUndefined(state))
      .map((state) => state.errors)
      .distinctUntilChanged();
  }

  /**
   * Method to retrieve form's data from state
   */
  public isFormInitialized(formId: string): Observable<boolean> {
    return this.store.select(formObjectFromIdSelector(formId))
      .distinctUntilChanged()
      .map((state) => isNotUndefined(state));
  }

  public getUniqueId(formId): string {
    return uniqueId() + '_' + formId;
  }

  /**
   * Method to validate form's fields
   */
  public validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  public addErrorToField(field: AbstractControl, model: DynamicFormControlModel, message: string) {
    const error = {}; // create the error object
    const errorKey = this.getValidatorNameFromMap(message);
    let errorMsg = message;

    // if form control model has not errorMessages object, create it
    if (!model.errorMessages) {
      model.errorMessages = {};
    }

    // check if error code is already present in the set of model's validators
    if (isEmpty(model.errorMessages[errorKey])) {
      // put the error message in the form control model
      model.errorMessages[errorKey] = message;
    } else {
      // Use correct error messages from the model
      errorMsg = model.errorMessages[errorKey];
    }

    if (!field.hasError(errorKey)) {
      error[errorKey] = true;
      // add the error in the form control
      field.setErrors(error);
    }

    field.markAsTouched();
  }

  public removeErrorFromField(field: AbstractControl, model: DynamicFormControlModel, messageKey: string) {
    const error = {};
    const errorKey = this.getValidatorNameFromMap(messageKey);

    if (field.hasError(errorKey)) {
      error[errorKey] = null;
      field.setErrors(error);
    }

    field.markAsUntouched();
  }

  public resetForm(formGroup: FormGroup, groupModel: DynamicFormControlModel[], formId: string) {
    this.formBuilderService.clearAllModelsValue(groupModel);
    formGroup.reset();
    this.store.dispatch(new FormChangeAction(formId, formGroup.value));
  }

  private getValidatorNameFromMap(validator): string {
    if (validator.includes('.')) {
      const splitArray = validator.split('.');
      if (splitArray && splitArray.length > 0) {
        validator = this.getValidatorNameFromMap(splitArray[splitArray.length - 1]);
      }
    }
    return (this.config.form.validatorMap.hasOwnProperty(validator)) ? this.config.form.validatorMap[validator] : validator;
  }
}
