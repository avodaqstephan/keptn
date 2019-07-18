// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	strfmt "github.com/go-openapi/strfmt"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/swag"
	"github.com/go-openapi/validate"
)

// OnboardServiceCE onboard service c e
// swagger:model OnboardServiceCE
type OnboardServiceCE struct {

	// contenttype
	Contenttype string `json:"contenttype,omitempty"`

	// extensions
	Extensions interface{} `json:"extensions,omitempty"`

	// id
	// Required: true
	ID *string `json:"id"`

	// shkeptncontext
	Shkeptncontext string `json:"shkeptncontext,omitempty"`

	// source
	// Required: true
	Source *string `json:"source"`

	// specversion
	// Required: true
	Specversion *string `json:"specversion"`

	// time
	// Format: date-time
	Time strfmt.DateTime `json:"time,omitempty"`

	// type
	// Required: true
	Type *string `json:"type"`

	// data
	Data *OnboardServiceCEAO1Data `json:"data,omitempty"`
}

// UnmarshalJSON unmarshals this object from a JSON structure
func (m *OnboardServiceCE) UnmarshalJSON(raw []byte) error {
	// AO0
	var dataAO0 struct {
		Contenttype string `json:"contenttype,omitempty"`

		Extensions interface{} `json:"extensions,omitempty"`

		ID *string `json:"id"`

		Shkeptncontext string `json:"shkeptncontext,omitempty"`

		Source *string `json:"source"`

		Specversion *string `json:"specversion"`

		Time strfmt.DateTime `json:"time,omitempty"`

		Type *string `json:"type"`
	}
	if err := swag.ReadJSON(raw, &dataAO0); err != nil {
		return err
	}

	m.Contenttype = dataAO0.Contenttype

	m.Extensions = dataAO0.Extensions

	m.ID = dataAO0.ID

	m.Shkeptncontext = dataAO0.Shkeptncontext

	m.Source = dataAO0.Source

	m.Specversion = dataAO0.Specversion

	m.Time = dataAO0.Time

	m.Type = dataAO0.Type

	// AO1
	var dataAO1 struct {
		Data *OnboardServiceCEAO1Data `json:"data,omitempty"`
	}
	if err := swag.ReadJSON(raw, &dataAO1); err != nil {
		return err
	}

	m.Data = dataAO1.Data

	return nil
}

// MarshalJSON marshals this object to a JSON structure
func (m OnboardServiceCE) MarshalJSON() ([]byte, error) {
	_parts := make([][]byte, 0, 2)

	var dataAO0 struct {
		Contenttype string `json:"contenttype,omitempty"`

		Extensions interface{} `json:"extensions,omitempty"`

		ID *string `json:"id"`

		Shkeptncontext string `json:"shkeptncontext,omitempty"`

		Source *string `json:"source"`

		Specversion *string `json:"specversion"`

		Time strfmt.DateTime `json:"time,omitempty"`

		Type *string `json:"type"`
	}

	dataAO0.Contenttype = m.Contenttype

	dataAO0.Extensions = m.Extensions

	dataAO0.ID = m.ID

	dataAO0.Shkeptncontext = m.Shkeptncontext

	dataAO0.Source = m.Source

	dataAO0.Specversion = m.Specversion

	dataAO0.Time = m.Time

	dataAO0.Type = m.Type

	jsonDataAO0, errAO0 := swag.WriteJSON(dataAO0)
	if errAO0 != nil {
		return nil, errAO0
	}
	_parts = append(_parts, jsonDataAO0)

	var dataAO1 struct {
		Data *OnboardServiceCEAO1Data `json:"data,omitempty"`
	}

	dataAO1.Data = m.Data

	jsonDataAO1, errAO1 := swag.WriteJSON(dataAO1)
	if errAO1 != nil {
		return nil, errAO1
	}
	_parts = append(_parts, jsonDataAO1)

	return swag.ConcatJSON(_parts...), nil
}

// Validate validates this onboard service c e
func (m *OnboardServiceCE) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateID(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSource(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateSpecversion(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateTime(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateType(formats); err != nil {
		res = append(res, err)
	}

	if err := m.validateData(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *OnboardServiceCE) validateID(formats strfmt.Registry) error {

	if err := validate.Required("id", "body", m.ID); err != nil {
		return err
	}

	return nil
}

func (m *OnboardServiceCE) validateSource(formats strfmt.Registry) error {

	if err := validate.Required("source", "body", m.Source); err != nil {
		return err
	}

	return nil
}

func (m *OnboardServiceCE) validateSpecversion(formats strfmt.Registry) error {

	if err := validate.Required("specversion", "body", m.Specversion); err != nil {
		return err
	}

	return nil
}

func (m *OnboardServiceCE) validateTime(formats strfmt.Registry) error {

	if swag.IsZero(m.Time) { // not required
		return nil
	}

	if err := validate.FormatOf("time", "body", "date-time", m.Time.String(), formats); err != nil {
		return err
	}

	return nil
}

func (m *OnboardServiceCE) validateType(formats strfmt.Registry) error {

	if err := validate.Required("type", "body", m.Type); err != nil {
		return err
	}

	return nil
}

func (m *OnboardServiceCE) validateData(formats strfmt.Registry) error {

	if swag.IsZero(m.Data) { // not required
		return nil
	}

	if m.Data != nil {
		if err := m.Data.Validate(formats); err != nil {
			if ve, ok := err.(*errors.Validation); ok {
				return ve.ValidateName("data")
			}
			return err
		}
	}

	return nil
}

// MarshalBinary interface implementation
func (m *OnboardServiceCE) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *OnboardServiceCE) UnmarshalBinary(b []byte) error {
	var res OnboardServiceCE
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}

// OnboardServiceCEAO1Data onboard service c e a o1 data
// swagger:model OnboardServiceCEAO1Data
type OnboardServiceCEAO1Data struct {

	// project
	// Required: true
	Project *string `json:"project"`
}

// Validate validates this onboard service c e a o1 data
func (m *OnboardServiceCEAO1Data) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validateProject(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *OnboardServiceCEAO1Data) validateProject(formats strfmt.Registry) error {

	if err := validate.Required("data"+"."+"project", "body", m.Project); err != nil {
		return err
	}

	return nil
}

// MarshalBinary interface implementation
func (m *OnboardServiceCEAO1Data) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *OnboardServiceCEAO1Data) UnmarshalBinary(b []byte) error {
	var res OnboardServiceCEAO1Data
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}
