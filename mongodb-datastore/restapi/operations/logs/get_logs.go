// Code generated by go-swagger; DO NOT EDIT.

package logs

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"net/http"

	errors "github.com/go-openapi/errors"
	middleware "github.com/go-openapi/runtime/middleware"
	strfmt "github.com/go-openapi/strfmt"
	swag "github.com/go-openapi/swag"
	validate "github.com/go-openapi/validate"
)

// GetLogsHandlerFunc turns a function with the right signature into a get logs handler
type GetLogsHandlerFunc func(GetLogsParams) middleware.Responder

// Handle executing the request and returning a response
func (fn GetLogsHandlerFunc) Handle(params GetLogsParams) middleware.Responder {
	return fn(params)
}

// GetLogsHandler interface for that can handle valid get logs params
type GetLogsHandler interface {
	Handle(GetLogsParams) middleware.Responder
}

// NewGetLogs creates a new http.Handler for the get logs operation
func NewGetLogs(ctx *middleware.Context, handler GetLogsHandler) *GetLogs {
	return &GetLogs{Context: ctx, Handler: handler}
}

/*GetLogs swagger:route GET /logs logs getLogs

gets the logs from the datastore

*/
type GetLogs struct {
	Context *middleware.Context
	Handler GetLogsHandler
}

func (o *GetLogs) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	route, rCtx, _ := o.Context.RouteInfo(r)
	if rCtx != nil {
		r = rCtx
	}
	var Params = NewGetLogsParams()

	if err := o.Context.BindValidRequest(r, route, &Params); err != nil { // bind params
		o.Context.Respond(rw, r, route.Produces, route, err)
		return
	}

	res := o.Handler.Handle(Params) // actually handle the request

	o.Context.Respond(rw, r, route.Produces, route, res)

}

// GetLogsDefaultBody get logs default body
// swagger:model GetLogsDefaultBody
type GetLogsDefaultBody struct {

	// code
	Code int64 `json:"code,omitempty"`

	// fields
	Fields string `json:"fields,omitempty"`

	// message
	// Required: true
	Message *string `json:"message"`
}

// Validate validates this get logs default body
func (o *GetLogsDefaultBody) Validate(formats strfmt.Registry) error {
	var res []error

	if err := o.validateMessage(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (o *GetLogsDefaultBody) validateMessage(formats strfmt.Registry) error {

	if err := validate.Required("getLogs default"+"."+"message", "body", o.Message); err != nil {
		return err
	}

	return nil
}

// MarshalBinary interface implementation
func (o *GetLogsDefaultBody) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *GetLogsDefaultBody) UnmarshalBinary(b []byte) error {
	var res GetLogsDefaultBody
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}

// GetLogsOKBodyItems0 get logs o k body items0
// swagger:model GetLogsOKBodyItems0
type GetLogsOKBodyItems0 struct {

	// id
	ID string `json:"id,omitempty"`

	// keptn context
	KeptnContext string `json:"keptnContext,omitempty"`

	// keptn service
	KeptnService string `json:"keptnService,omitempty"`

	// log level
	LogLevel string `json:"logLevel,omitempty"`

	// message
	Message string `json:"message,omitempty"`
}

// Validate validates this get logs o k body items0
func (o *GetLogsOKBodyItems0) Validate(formats strfmt.Registry) error {
	return nil
}

// MarshalBinary interface implementation
func (o *GetLogsOKBodyItems0) MarshalBinary() ([]byte, error) {
	if o == nil {
		return nil, nil
	}
	return swag.WriteJSON(o)
}

// UnmarshalBinary interface implementation
func (o *GetLogsOKBodyItems0) UnmarshalBinary(b []byte) error {
	var res GetLogsOKBodyItems0
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*o = res
	return nil
}
