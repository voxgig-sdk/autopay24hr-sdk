package core

import "encoding/json"

type Autopay24hrError struct {
	IsAutopay24hrError bool
	Sdk                string
	Code               string
	Msg                string
	// Reachable for a debugger, invisible to a serialiser: the context holds
	// the live spec and options, and an error is what gets logged.
	Ctx    *Context `json:"-"`
	Result any
	Spec   any
	// The HTTP status, -1 when there was no response.
	Status int
}

func NewAutopay24hrError(code string, msg string, ctx *Context) *Autopay24hrError {
	return &Autopay24hrError{
		IsAutopay24hrError: true,
		Sdk:                "Autopay24hr",
		Code:               code,
		Msg:                msg,
		Ctx:                ctx,
		Status:             -1,
	}
}

func (e *Autopay24hrError) NotFound() bool {
	return 404 == e.Status
}

func (e *Autopay24hrError) Error() string {
	return e.Msg
}

// What makeError attached is already cleaned; the context is not part of
// the record.
func (e *Autopay24hrError) Record() map[string]any {
	return map[string]any{
		"sdk":     e.Sdk,
		"code":    e.Code,
		"message": e.Msg,
		"status":  e.Status,
		"result":  e.Result,
		"spec":    e.Spec,
	}
}

func (e *Autopay24hrError) MarshalJSON() ([]byte, error) {
	return json.Marshal(e.Record())
}
