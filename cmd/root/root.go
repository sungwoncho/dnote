package root

import (
	"github.com/dnote/cli/core"
	"github.com/dnote/cli/infra"
	"github.com/dnote/cli/migrate"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

var root = &cobra.Command{
	Use:           "dnote",
	Short:         "Dnote - Instantly capture what you learn while coding",
	SilenceErrors: true,
	SilenceUsage:  true,
}

// Register adds a new command
func Register(cmd *cobra.Command) {
	root.AddCommand(cmd)
}

// Execute runs the main command
func Execute() error {
	return root.Execute()
}

// Prepare initializes necessary files
func Prepare(ctx infra.DnoteCtx) error {
	if err := core.InitFiles(ctx); err != nil {
		return errors.Wrap(err, "initializing files")
	}

	if err := infra.InitDB(ctx); err != nil {
		return errors.Wrap(err, "initializing database")
	}

	// perform any necessary legacy migration
	if err := migrate.Migrate(ctx); err != nil {
		return errors.Wrap(err, "running migration")
	}

	return nil
}
